import React, { useState } from 'react';
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  Image as ImageIcon
} from 'lucide-react';
import classNames from 'classnames';
import Tooltip from '@mui/material/Tooltip';

interface TableColumn {
  key: string;
  label: string;
  width?: string;
  type?: 'text' | 'image' | 'avatar';
  imageSize?: 'small' | 'medium' | 'large' | number;
  fallbackText?: string;
}

interface TableRow {
  id: string;
  [key: string]: any;
}

interface PaginationData {
  totalCount: number;
  skip: number;
  take: number;
}

interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  pagination: PaginationData;
  title?: string;
  searchable?: boolean;
  actions?: boolean;
  creatable?: boolean;
  createButtonText?: string;
  onRowClick?: (row: TableRow) => void;
  onEdit?: (row: TableRow) => void;
  onDelete?: (row: TableRow) => void;
  onView?: (row: TableRow) => void;
  onCreate?: () => void;
  onPageChange?: (skip: number, take: number) => void;
  onSearch?: (searchTerm: string) => void;
}

const TableImage: React.FC<{
  src: string;
  alt?: string;
  size: 'small' | 'medium' | 'large' | number;
  type: 'image' | 'avatar';
  fallbackText?: string;
}> = ({ src, alt = '', size, type, fallbackText }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-12 h-12';
      case 'medium':
        return 'w-20 h-20';
      case 'large':
        return 'w-30 h-30';
      default:
        return `w-[${size}] h-[${size}]`;
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  if (!src || imageError) {
    return (
      <div className={`${getSizeClasses()} bg-gray-100 rounded-${type === 'avatar' ? 'full' : 'lg'} flex items-center justify-center`}>
        {fallbackText ? (
          <span className="text-xs font-medium text-gray-500 uppercase">
            {fallbackText.slice(0, 2)}
          </span>
        ) : (
          <ImageIcon className="w-4 h-4 text-gray-400" />
        )}
      </div>
    );
  }

  return (
    <div className={`${getSizeClasses()} relative`}>
      {imageLoading && (
        <div className={`${getSizeClasses()} bg-gray-100 rounded-${type === 'avatar' ? 'full' : 'lg'} animate-pulse absolute inset-0`} />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`${getSizeClasses()} object-cover rounded-${type === 'avatar' ? 'full' : 'lg'} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
      />
    </div>
  );
};

const TableCell: React.FC<{
  column: TableColumn;
  value: any;
  row: TableRow;
}> = ({ column, value, row }) => {
  const { type = 'text', imageSize = 'medium', fallbackText } = column;

  const shouldTruncate = type === 'text' && typeof value === 'string' && value.length > 150;
  const truncatedText = shouldTruncate ? `${value.substring(0, 60)}...` : value;

  switch (type) {
    case 'image':
    case 'avatar':
      return (
        <div className="flex items-center">
          <TableImage
            src={value}
            alt={`${column.label} for ${row.id}`}
            size={imageSize}
            type={type}
            fallbackText={fallbackText || (typeof row.name === 'string' ? row.name : row.title)}
          />
        </div>
      );

    case 'text':
    default:
      return (
        <Tooltip title={value}>
            <div
          className="flex items-center relative"
        >
          {truncatedText}
        </div>
        </Tooltip>
      );
  }
};

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  pagination,
  title = "Data Table",
  searchable = true,
  actions = true,
  creatable = false,
  createButtonText = "Create New",
  onRowClick,
  onEdit,
  onDelete,
  onView,
  onCreate,
  onPageChange,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { totalCount, skip, take } = pagination;
  const currentPage = skip + 1;
  const totalPages = Math.ceil(totalCount / take);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handlePageChange = (newPage: number) => {
    const newSkip = (newPage-1);
    onPageChange?.(newSkip, take);
  };

  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push({ type: 'page', value: i });
      }
    } else {
      pages.push({ type: 'page', value: 1 });

      if (currentPage > delta + 2) {
        pages.push({ type: 'ellipsis', value: '...' });
      }

      const start = Math.max(2, currentPage - delta);
      const end = Math.min(totalPages - 1, currentPage + delta);

      for (let i = start; i <= end; i++) {
        pages.push({ type: 'page', value: i });
      }

      if (currentPage < totalPages - delta - 1) {
        pages.push({ type: 'ellipsis', value: '...' });
      }

      pages.push({ type: 'page', value: totalPages });
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {totalCount} {totalCount === 1 ? 'item' : 'items'} total
            </p>
          </div>

          <div className="flex items-center gap-3">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm w-64"
                />
              </div>
            )}

            {creatable && onCreate && (
              <button
                onClick={onCreate}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-tab hover:from-primary hover:to-tab text-white font-medium rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                {createButtonText}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-lg font-medium text-gray-500 mb-2">No data found</p>
                    <p className="text-sm text-gray-400">
                      {searchTerm ? 'Try adjusting your search terms' : 'There are no items to display'}
                    </p>
                    {creatable && onCreate && !searchTerm && (
                      <button
                        onClick={onCreate}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-tab hover:from-primary hover:to-tab text-white font-medium rounded-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200"
                      >
                        <Plus className="w-4 h-4" />
                        {createButtonText}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                      <TableCell
                        column={column}
                        value={row[column.key]}
                        row={row}
                      />
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {onView && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(row);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(row);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bg-gradient-to-r from-gray-50 to-white border-t border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {skip + 1} to {Math.min(skip + take, totalCount)} of {totalCount} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>

              {getPageNumbers().map((item, index) => (
                item.type === 'ellipsis' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-3 py-2 text-sm font-medium text-gray-400"
                  >
                    {item.value}
                  </span>
                ) : (
                  <button
                    key={item.value}
                    onClick={() => handlePageChange(item.value as number)}
                    className={classNames(
                      'px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      {
                        'bg-gradient-to-r from-primary to-tab text-white shadow-lg shadow-primary/25': currentPage === item.value,
                        'text-gray-500 bg-white border border-gray-200 hover:bg-gray-50': currentPage !== item.value
                      }
                    )}
                  >
                    {item.value}
                  </button>
                )
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

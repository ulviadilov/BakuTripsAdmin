import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { blogsService } from "../../services/blogs";
import { paths } from "../../constants/path";

function toYouTubeEmbed(url?: string | null) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    // Already embed
    if (host.includes("youtube.com") && u.pathname.startsWith("/embed/")) return u.toString();
    // Standard watch URL -> /embed/{id}
    if (host.includes("youtube.com") && u.pathname === "/watch") {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    // youtu.be short URL -> /embed/{id}
    if (host === "youtu.be") {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    // shorts URL -> /embed/{id}
    if (host.includes("youtube.com") && u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.split("/")[2];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

export default function BlogDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data, isPending, error } = useQuery({
    queryKey: ["blog", id, "detail"],
    queryFn: () => blogsService.getById(id!),
    enabled: !!id,
  });

  const blog = data?.data?.blog;

  if (isPending) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 text-lg font-medium">Loading blog...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error ? "Failed to Load Blog" : "Blog Not Found"}</h2>
          <p className="text-gray-600 mb-6">{error ? "There was an error loading the blog details." : "The requested blog could not be found."}</p>
          <button onClick={() => navigate(paths.BLOG.LIST)} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  const firstVideoEmbed = toYouTubeEmbed(blog.firstVideoUrl);
  const secondVideoEmbed = toYouTubeEmbed(blog.secondVideoUrl);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate(paths.BLOG.LIST)} className="inline-flex items-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Back to blogs">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{blog.mainTitle}</h1>
                <p className="text-gray-600">By <span className="font-medium">{blog.authorName}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Images */}
        {(blog.firstImagePath || blog.secondImagePath) && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {blog.firstImagePath && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="aspect-[16/9] relative">
                    <img src={blog.firstImagePath} alt={`${blog.mainTitle} - First image`} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">First Image</span>
                    </div>
                  </div>
                </div>
              )}
              {blog.secondImagePath && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="aspect-[16/9] relative">
                    <img src={blog.secondImagePath} alt={`${blog.mainTitle} - Second image`} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">Second Image</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Descriptions */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Blog Content</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Main Description</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{blog.mainDescription}</p>
            </div>
            {(blog.subTitle || blog.subDescription) && (
              <div>
                {blog.subTitle && <h3 className="text-lg font-semibold text-gray-900 mb-4">{blog.subTitle}</h3>}
                {blog.subDescription && <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{blog.subDescription}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Videos */}
        {(firstVideoEmbed || secondVideoEmbed) && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-7 h-7 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Video Content
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {firstVideoEmbed && (
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-black">
                  <div className="relative aspect-[16/9]">
                    <iframe
                      src={firstVideoEmbed}
                      title={`${blog.mainTitle} - First video`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
              {secondVideoEmbed && (
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-black">
                  <div className="relative aspect-[16/9]">
                    <iframe
                      src={secondVideoEmbed}
                      title={`${blog.mainTitle} - Second video`}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

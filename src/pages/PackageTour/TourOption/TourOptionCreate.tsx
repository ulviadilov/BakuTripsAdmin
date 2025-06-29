import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { QUERY_KEYS } from "../../../constants/queryKeys";
import { packageTourService } from "../../../services/packageTour";
import Select from "../../../components/Select";
import Input from "../../../components/Input";
import { ArrayInput } from "../../../components/ArrayInput";
import { FileUpload } from "../../../components/FIleUpload";
import { packageOptionService } from "../../../services/packageTour/option";
import type { PackageTourOption } from "../../../types";
import { paths } from "../../../constants/path";

const schema = yup.object({
  packageid: yup.string().required("Package Id is required"),
  displayorder: yup.string().required("Order is required").min(0, "Order must be at least 0"),
  optionname: yup.string().required("Tour name is required").min(2, "Name must be at least 2 characters"),
  mapurl: yup.string().url("Must be a valid URL").required("Google Map URL is required"),
  shortdescription: yup.string().required("Short description is required").min(10, "Short description must be at least 10 characters"),
  apartmentinfo: yup.string().required("Apartment info is required"),
  roominfo: yup.string().required("Room info is required"),
  vehicleinfo: yup.string().required("Vehicle info is required"),
  fulldescription: yup.string().required("Full description is required").min(50, "Full description must be at least 50 characters"),
  price: yup.number().required("Price is required").min(0, "Price must be positive"),
  importantinfos: yup.array().of(yup.string().required()).min(1, "At least one important info is required").required(),
  includes: yup.array().of(yup.string().required()).min(1, "At least one include is required").required(),
  excludes: yup.array().of(yup.string().required()).min(1, "At least one exclude is required").required(),
  vrimagefile: yup.mixed<File>().required("VR image is required").nullable(),
  tourimagefiles: yup.array().of(yup.mixed<File>().required()).min(1, "At least one tour image is required").required()
}) as yup.ObjectSchema<PackageTourOption>;

export default function TourOptionCreate() {
  const navigate = useNavigate();

  const { data, isPending } = useQuery({
    queryKey: [QUERY_KEYS.packageOption.select],
    queryFn: packageTourService.getPackageSelect
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PackageTourOption>({
    resolver: yupResolver(schema),
    defaultValues: {
      packageid: '',
      displayorder: "0",
      optionname: '',
      mapurl: '',
      shortdescription: '',
      apartmentinfo: '',
      roominfo: '',
      vehicleinfo: '',
      fulldescription: '',
      price: 0,
      importantinfos: [],
      includes: [],
      excludes: [],
      vrimagefile: null,
      tourimagefiles: []
    }
  });

  const mutation = useMutation({
    mutationFn: packageOptionService.createOption,
    onSuccess: () => {
      toast.success('Tour created successfully');
      reset();
      navigate(paths.PACKAGE_TOUR_OPTION.LIST);
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create tour');
    }
  });

  const onSubmit = async (data: PackageTourOption) => {
    mutation.mutate(data);
  };

  const handleBack = () => {
    navigate(paths.PACKAGE_TOUR_OPTION.LIST);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Go back"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Create Tour Package</h1>
            <p className="text-gray-600 text-sm mt-1">Add a new tour package option</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                name="packageid"
                control={control}
                label="Package"
                placeholder="Select package"
                required={true}
                isPending={isPending}
                options={data?.data || []}
                error={errors.packageid?.message}
              />

              <Input
                name="displayorder"
                control={control}
                label="Display Order"
                type="number"
                placeholder="Enter display order"
                required={true}
                error={errors.displayorder?.message}
              />

              <Input
                name="optionname"
                control={control}
                label="Option Name"
                type="text"
                placeholder="Enter option name"
                required={true}
                error={errors.optionname?.message}
              />

              <Input
                name="mapurl"
                control={control}
                label="Google Map URL"
                type="text"
                placeholder="Enter Google Map URL"
                required={true}
                error={errors.mapurl?.message}
              />

              <Input
                name="price"
                control={control}
                label="Price"
                type="number"
                placeholder="Enter price"
                required={true}
                error={errors.price?.message}
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Descriptions</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="shortdescription"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      placeholder="Enter short description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  )}
                />
                {errors.shortdescription && (
                  <p className="text-red-500 text-sm">{errors.shortdescription.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Apartment Info <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="apartmentinfo"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      placeholder="Enter apartment info"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  )}
                />
                {errors.apartmentinfo && (
                  <p className="text-red-500 text-sm">{errors.apartmentinfo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Room Info <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="roominfo"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      placeholder="Enter room info"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  )}
                />
                {errors.roominfo && (
                  <p className="text-red-500 text-sm">{errors.roominfo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Info <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="vehicleinfo"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      placeholder="Enter vehicle info"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  )}
                />
                {errors.vehicleinfo && (
                  <p className="text-red-500 text-sm">{errors.vehicleinfo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="fulldescription"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={6}
                      placeholder="Enter full description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                    />
                  )}
                />
                {errors.fulldescription && (
                  <p className="text-red-500 text-sm">{errors.fulldescription.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tour Details Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tour Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArrayInput
                name="includes"
                control={control}
                label="Includes"
                placeholder="Add what's included..."
                required={true}
                error={errors.includes?.message}
                icon={
                  <svg className="w-4 h-4 inline text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              />

              <ArrayInput
                name="excludes"
                control={control}
                label="Excludes"
                placeholder="Add what's excluded..."
                required={true}
                error={errors.excludes?.message}
                icon={
                  <svg className="w-4 h-4 inline text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              />

              <ArrayInput
                name="importantinfos"
                control={control}
                label="Important Information"
                placeholder="Add important info..."
                required={true}
                error={errors.importantinfos?.message}
                icon={
                  <svg className="w-4 h-4 inline text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
            <div className="space-y-6">
              {/* VR Image */}
              <FileUpload
                name="vrimagefile"
                control={control}
                accept="image/*"
                multiple={false}
                maxSize={100}
                maxFiles={1}
                label="VR Image"
                description="VR image for the tour (Required, Max 5MB)"
                showPreview={true}
                error={errors.vrimagefile?.message}
                required={true}
              />

              {/* Tour Images */}
              <FileUpload
                name="tourimagefiles"
                control={control}
                accept="image/*"
                multiple={true}
                maxSize={100}
                maxFiles={10}
                label="Tour Images"
                description="Additional tour images (Required, Max 10 files, 5MB each)"
                showPreview={true}
                error={errors.tourimagefiles?.message}
                required={true}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 flex items-center space-x-3">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="bg-slate-800 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
            >
              {mutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Tour...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Tour
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBack}
              disabled={mutation.isPending}
              className="px-8 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useFormDraft, clearDraft } from "../../utils/draft";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../components/Input";
import { FileUpload } from "../../components/FIleUpload";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { paths } from "../../constants/path";
import { otherLanguages } from "../../constants";
import { customPlaceService } from "../../services/customPackage/place";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  placeImage: yup.mixed<File>().required("Place Image is required"),
  translations: yup.array().of(
    yup.object({
      languageCode: yup.string().required(),
      name: yup.string().required("Name is required"),
    })
  ).required(),
});

type FormType = yup.InferType<typeof schema>;

export default function PlaceCreate() {
  const navigate = useNavigate();
  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<FormType>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      placeImage: undefined as any,
      translations: otherLanguages.map((l) => ({ languageCode: l.code, name: "" })),
    },
  });

  // Persist place draft (omit placeImage)
  useFormDraft<FormType>("create:place", { reset, watch }, { omit: ["placeImage"] });

  const { fields } = useFieldArray({ control, name: "translations" });
  const [activeLang, setActiveLang] = useState(otherLanguages[0]?.code || "");

  const mutation = useMutation({
    mutationFn: (data: FormType) => customPlaceService.createPlace(data as any),
    onSuccess: () => {
      toast.success("Place created successfully");
      clearDraft("create:place");
      navigate(paths.CUSTOM_PLACE.LIST);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create Place");
    }
  });

  const onSubmit = (data: FormType) => mutation.mutate(data);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(paths.CUSTOM_PLACE.LIST)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Go back">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Create Place</h1>
            <p className="text-gray-600 text-sm mt-1">Add a new custom place</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input name="name" control={control} label="Name" placeholder="Name" error={errors.name?.message} required />
        <FileUpload name="placeImage" control={control} label="Place Image" error={errors.placeImage?.message as string} multiple={false} accept="image/*" required />

        {otherLanguages.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Translations</h3>
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {otherLanguages.map((lang) => (
                  <button key={lang.code} type="button" onClick={() => setActiveLang(lang.code)} className={`${activeLang === lang.code ? "border-slate-500 text-slate-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                    {lang.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-6">
              {fields.map((field, index) => (
                <div key={field.id} style={{ display: activeLang === field.languageCode ? "block" : "none" }}>
                  <div className="space-y-4">
                    <Input name={`translations.${index}.name`} control={control} label="Name" placeholder="Translated Name" error={errors.translations?.[index]?.name?.message} required />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex items-center space-x-3">
          <button type="submit" disabled={mutation.isPending} className="bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
            {mutation.isPending ? "Creating..." : "Create Place"}
          </button>
          <button type="button" onClick={() => navigate(paths.CUSTOM_PLACE.LIST)} disabled={mutation.isPending} className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200">Cancel</button>
        </div>
      </form>
    </div>
  );
}

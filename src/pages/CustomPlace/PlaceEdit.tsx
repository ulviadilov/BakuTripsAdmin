import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "../../components/Input";
import { FileUpload } from "../../components/FIleUpload";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { paths } from "../../constants/path";
import { otherLanguages } from "../../constants";
import { customPlaceService } from "../../services/customPackage/place";

const schema = yup.object({
  Name: yup.string().required("Name is required"),
  PlaceImage: yup.mixed<File>().nullable().notRequired(),
  Translations: yup.array().of(
    yup.object({
      languageCode: yup.string().required(),
      name: yup.string().required("Name is required"),
    })
  ).required(),
});

export default function PlaceEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      Name: "",
      PlaceImage: null as any,
      Translations: otherLanguages.map((l) => ({ languageCode: l.code, name: "" })),
    }
  });

  const { fields } = useFieldArray({ control, name: "Translations" });
  const [activeLang, setActiveLang] = useState(otherLanguages[0]?.code || "");

  const { data } = useQuery({
    queryKey: ["custom-places", "detail", id],
    queryFn: () => customPlaceService.getPlaceById(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (data?.data?.place) {
      const place = data.data.place;
      setValue("Name", place.name || "");
      // prefill translations from either key
      const tr = (place.Translations || place.translations || []) as any[];
      const filled = otherLanguages.map((l) => {
        const found = tr.find((t) => (t.languageCode || "").toLowerCase() === l.code.toLowerCase());
        return { languageCode: l.code, name: found?.name || "" };
      });
      setValue("Translations", filled as any);
    }
  }, [data, setValue]);

  const mutation = useMutation({
    mutationFn: (payload: any) => customPlaceService.updatePlace(id as string, payload as any),
    onSuccess: () => {
      toast.success("Place updated successfully");
      navigate(paths.CUSTOM_PLACE.LIST);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update Place");
    }
  });

  const onSubmit = (data: any) => mutation.mutate(data);

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
            <h1 className="text-2xl font-semibold text-gray-900">Edit Place</h1>
            <p className="text-gray-600 text-sm mt-1">Update a custom place</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input name="Name" control={control} label="Name" placeholder="Name" error={errors.Name?.message} required />
        <FileUpload name="PlaceImage" control={control} label="Place Image" error={errors.PlaceImage?.message as string} accept="image/*" initialUrls={
            data?.data.place.placeImagePath
        }  />

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
                    <Input name={`Translations.${index}.name`} control={control} label="Name" placeholder="Translated Name" error={errors.Translations?.[index]?.name?.message} required />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex items-center space-x-3">
          <button type="submit" disabled={mutation.isPending} className="bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
            {mutation.isPending ? "Updating..." : "Update Place"}
          </button>
          <button type="button" onClick={() => navigate(paths.CUSTOM_PLACE.LIST)} disabled={mutation.isPending} className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors duration-200">Cancel</button>
        </div>
      </form>
    </div>
  );
}

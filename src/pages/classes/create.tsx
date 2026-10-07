import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import UploadWidget from "@/components/upload-widget";
import { subjects, teachers } from "@/constants";
import { classSchema } from "@/lib/schema";
import { UploadWidgetValue } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBack } from "@refinedev/core";
import { Loader2 } from "lucide-react";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";

type ClassFormValues = z.infer<typeof classSchema>;

const Create = () => {
  const back = useBack();

  const form = useForm<z.infer<typeof classSchema>>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      subjectId: undefined,
      teacherId: undefined,
      capacity: undefined,
      status: undefined,
      description: undefined,
      bannerUrl: undefined,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
  } = form;

  const onSubmit = (data: z.infer<typeof classSchema>) => {
    try {
      console.log(data);
    } catch (e) {
      console.log("Error creating new classes", e);
    }
  };

  const bannerPublicId = form.watch("bannerCldPubId");

  const setBannerImage = (
    file: UploadWidgetValue | null,
    field: ControllerRenderProps<ClassFormValues, "bannerUrl">
  ) => {
    if (file) {
      field.onChange(file.url);
      form.setValue("bannerCldPubId", file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field.onChange("");
      form.setValue("bannerCldPubId", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <CreateView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Create a Class</h1>
      <div className="intro-row">
        <p>Provide the required information below to add a class.</p>
        <Button className="cursor-pointer" onClick={back}>
          Go Back
        </Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="pb-0 text-2xl font-bold">
              Fill out the form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-5">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="bannerUrl"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        Banner Image <span className="text-orange-600">*</span>
                      </FieldLabel>
                      <UploadWidget
                        value={
                          field.value
                            ? {
                                url: field.value,
                                publicId: bannerPublicId ?? "",
                              }
                            : null
                        }
                        onChange={(file) => setBannerImage(file, field)}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                      {errors.bannerCldPubId && errors.bannerUrl && (
                        <p className="text-destructive text-sm">
                          {errors.bannerCldPubId.message?.toString()}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        Class Name <span className="text-orange-600">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-rhf-demo-title"
                        aria-invalid={fieldState.invalid}
                        placeholder="Introduction to Biology - Section A"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="subjectId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                          Subject <span className="text-orange-600">*</span>
                        </FieldLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={
                            field.value != null
                              ? String(field.value)
                              : undefined
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem
                                value={subject.id.toString()}
                                key={subject.id}
                              >
                                {subject.name} ({subject.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="teacherId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                          Teacher <span className="text-orange-600">*</span>
                        </FieldLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(String(value))
                          }
                          value={
                            field.value != null
                              ? String(field.value)
                              : undefined
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem
                                value={teacher.id.toString()}
                                key={teacher.id}
                              >
                                {teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="capacity"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                          Capacity <span className="text-orange-600">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          type="number"
                          min={0}
                          id="form-rhf-demo-title"
                          aria-invalid={fieldState.invalid}
                          placeholder="30"
                          autoComplete="off"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="status"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-rhf-demo-title">
                          Status <span className="text-orange-600">*</span>
                        </FieldLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(String(value))
                          }
                          value={
                            field.value != null
                              ? String(field.value)
                              : undefined
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-rhf-demo-title">
                        Description <span className="text-orange-600">*</span>
                      </FieldLabel>
                      <Textarea
                        placeholder="Brief description about the class"
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Separator />
              </FieldGroup>
              <Button type="submit" size="lg" className="w-full cursor-pointer">
                {isSubmitting ? (
                  <div className="flex gap-1">
                    <span>Creating Class...</span>
                    <Loader2 className="ml-2 inline-block animate-spin" />
                  </div>
                ) : (
                  "Create Class"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </CreateView>
  );
};

export default Create;

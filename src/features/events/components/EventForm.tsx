import { FormError, FormSuccess } from '@/components/custom';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { MultiSelect } from '@/components/ui/multi-select';

import { TextEditor } from '@/components/custom/editor';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/input';
import { eventCategories } from '@/constants/event';
import NextImage from 'next/image';
import { Controller } from 'react-hook-form';
import { CreateEvent } from '../schema/event';
import { EventFormProps } from '../types/event';

export const EventForm = ({
  form,
  onSubmit,
  handleResetEvent,
  handleCoverImageChange,
  coverImagePreview,
  handleContainerClick,
  fileInputRef,
  isPending,
  error,
  success,
  editor,
  isEditing,
}: EventFormProps<CreateEvent>) => {
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.setValue('description', editor?.getHTML() || '');
            form.handleSubmit(onSubmit)();
          }}
          className="flex h-screen w-full flex-col items-center gap-3 overflow-hidden"
        >
          <div className="flex w-full gap-8">
            <div className="flex w-1/4 flex-col gap-4">
              <FormField
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl className="rounded-md border-gray-300">
                      <Input
                        {...field}
                        type="text"
                        disabled={isPending}
                        placeholder="Event Title"
                        className={fieldState.invalid ? 'border-red-500' : ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl className="rounded-md border-gray-300">
                      <Input
                        min="0"
                        {...field}
                        type="number"
                        placeholder="Price"
                        disabled={isPending}
                        className={fieldState.invalid ? 'border-red-500' : ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl className="rounded-md border-gray-300">
                      <Input
                        {...field}
                        type="text"
                        disabled={isPending}
                        placeholder="Location"
                        className={fieldState.invalid ? 'border-red-500' : ''}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="startDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="rounded-md border-gray-300">
                      <DatePicker
                        {...field}
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name="endDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="rounded-md border-gray-300">
                      <DatePicker
                        {...field}
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Controller
                name="categories"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl className="rounded-md border-gray-300">
                      <MultiSelect
                        {...field}
                        maxSelect={3}
                        disabled={isPending}
                        options={eventCategories}
                        placeholder="Select categories..."
                        className={`rounded-md border-gray-300 text-gray-500 ${fieldState.invalid ? 'border-red-500' : ''}`}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Cover Image Section */}
              <Controller
                name="coverImage"
                control={form.control}
                rules={{ required: 'Cover image is required.' }}
                render={({ field, fieldState }) => (
                  <div
                    onClick={handleContainerClick}
                    className={`relative flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed ${
                      fieldState.error ? 'border-red-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleCoverImageChange(file);
                          form.setValue('coverImage', file.name);
                        }
                      }}
                    />
                    {coverImagePreview ? (
                      <NextImage
                        width={160}
                        height={160}
                        alt="Cover Preview"
                        src={coverImagePreview}
                        className="absolute inset-0 h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <span className={`text-sm ${fieldState.error ? 'text-red-500' : 'text-gray-500'}`}>
                        {fieldState.error?.message || 'Click to upload cover image'}
                      </span>
                    )}
                  </div>
                )}
              />

              {/* Reset and Submit Buttons */}
              <div className="mt-2 flex w-full flex-col gap-2">
                <FormError message={error} />
                <FormSuccess message={success} />

                <Button
                  type="button"
                  onClick={handleResetEvent}
                  className="w-full rounded-md bg-red-200 p-2 font-semibold text-black hover:bg-red-100"
                >
                  Reset
                </Button>
                <Button type="submit" className="w-full rounded-md p-2 font-semibold text-white">
                  {isEditing ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </div>

            {/* Text Editor */}
            <div className="w-3/4">
              <TextEditor editor={editor} />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

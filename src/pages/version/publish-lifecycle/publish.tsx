import { publishUnpublishedVersion } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { VersionSchema } from "@/types/api/page";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function PublishVersion({
  version,
}: {
  version: VersionSchema;
}) {
  const { id, workspace, project, page } = version;
  const mutationParams = {
    workspaceId: workspace.id,
    projectId: project.id,
    pageId: page.id,
    versionId: id,
  };

  const releaseVersionRequestZSchema = z.object({
    releaseName: z.string().min(1, "Release name must be provided"),
  });

  type releaseVersionRequestSchema = z.infer<
    typeof releaseVersionRequestZSchema
  >;
  const releaseVersionForm = useForm<releaseVersionRequestSchema>({
    resolver: zodResolver(releaseVersionRequestZSchema),
    values: {
      releaseName: "",
    },
  });

  const publishVersionMutation = useMutation({
    mutationFn: async ({
      workspaceId,
      projectId,
      pageId,
      versionId,
      releaseName,
    }: {
      workspaceId: string;
      projectId: string;
      pageId: string;
      versionId: string;
      releaseName: string;
    }) =>
      publishUnpublishedVersion(
        workspaceId,
        projectId,
        pageId,
        versionId,
        releaseName
      ),
    onSuccess: () => {
      window.location.reload();
    },
    onError: (e: Error) => {
      console.log(e.message);
    },
  });

  const onReleaseVersionFormSubmit = ({
    releaseName,
  }: {
    releaseName: string;
  }) => {
    publishVersionMutation.mutate({
      ...mutationParams,
      releaseName,
    });
  };

  const [isPublishVersionDialogOpen, setIsPublishVersionDialogOpen] =
    useState<boolean>(false);

  return (
    <Dialog open={isPublishVersionDialogOpen}>
      <DialogTrigger asChild>
        {!workspace.isUserWorkspace && (
          <Button
            variant="ghost"
            className="bg-green-600 text-white mr-2"
            onClick={() => setIsPublishVersionDialogOpen(true)}
          >
            Publish
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Reviewers</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...releaseVersionForm}>
          <form
            onSubmit={releaseVersionForm.handleSubmit(
              onReleaseVersionFormSubmit
            )}
            className="space-y-4"
          >
            <FormField
              control={releaseVersionForm.control}
              name="releaseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a version name"
                      className={cn(
                        releaseVersionForm.formState.errors["releaseName"] &&
                          "bg-red-50"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-right">
              <Button
                className="mt-2 mr-2"
                variant="secondary"
                type="submit"
                onClick={() => setIsPublishVersionDialogOpen(false)}
              >
                Close
              </Button>
              <Button className="mt-2" type="submit">
                Release
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

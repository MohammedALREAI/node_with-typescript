import { Box, Button } from "@chakra-ui/core";
import { Form, useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  useIsAuth();
  const [createPost] = useCreatePostMutation();
  const postFormIk = useFormik<{ title: string; text: string }>({
    initialValues: { title: "", text: "" },
    onSubmit: async (values, { resetForm }) => {
      const { errors } = await createPost({
        variables: { input: values },
        update: (cache) => {
          cache.evict({ fieldName: "posts:{}" });
        },
      });
      resetForm();

      if (!errors) {
        router.push("/");
      }
    },
  });

  return (
    <Layout variant="small">
      <Form onSubmit={postFormIk.handleSubmit}>
        <InputField
          name="title"
          placeholder="title"
          label="Title"
          value={postFormIk.values.title}
        />
        {postFormIk.errors.title && postFormIk.touched.title
          ? postFormIk.errors.title
          : ""}
        <Box mt={4}>
          <InputField
            textarea
            name="text"
            value={postFormIk.values.text}
            placeholder="text..."
            label="Body"
          />
        </Box>
        {postFormIk.errors.text && postFormIk.touched.text
          ? postFormIk.errors.text
          : ""}

        <Button
          mt={4}
          type="submit"
          isLoading={postFormIk.isSubmitting}
          variantColor={postFormIk.isSubmitting ? "black" : "teal"}
        >
          {postFormIk.isSubmitting ? "wait" : "create post"}
        </Button>
      </Form>
    </Layout>
  );
};

export default withApollo({ ssr: false })(CreatePost);

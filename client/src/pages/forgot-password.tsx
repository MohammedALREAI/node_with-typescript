import React, { useState } from "react";
import { Wrapper } from "../components/Wrapper";
import { Form, useFormik } from "formik";
import { InputField } from "../components/InputField";
import { Box, Button } from "@chakra-ui/core";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  const ForgotPasswordIForm = useFormik<{ email: string }>({
    initialValues: { email: "" },
    onSubmit: async (values, { resetForm }) => {
      await forgotPassword({ variables: values });
      setComplete(true);
      resetForm();
    },
  });
  return (
    <Wrapper variant="small">
      {complete ? (
        <Box>if an account with that email exists, we sent you can email</Box>
      ) : (
        <Form onSubmit={ForgotPasswordIForm.handleSubmit}>
          <InputField
            name="email"
            placeholder="email"
            label="Email"
            value={ForgotPasswordIForm.values.email}
            type="email"
          />
          {ForgotPasswordIForm.touched.email && ForgotPasswordIForm.errors.email
            ? ForgotPasswordIForm.errors.email
            : ""}{" "}
          <Button
            mt={4}
            type="submit"
            isLoading={ForgotPasswordIForm.isSubmitting}
            variantColor={ForgotPasswordIForm.isSubmitting ? "black" : "teal"}
          >
            {ForgotPasswordIForm.isSubmitting ? "wait" : "forgot password"}
          </Button>
        </Form>
      )}
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);

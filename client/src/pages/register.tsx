import React from "react";
import { Form, useFormik } from "formik";
import { Box, Button } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation, MeQuery, MeDocument } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "../utils/withApollo";
import { NextPage } from "next";
import { validation } from "../utils/vaildation";
const Register: NextPage = ({}) => {
  const router = useRouter();
  const [register] = useRegisterMutation();
  const SignupFormIk = useFormik<{
    email: string;
    username: string;
    password: string;
  }>({
    initialValues: { email: "", username: "", password: "" },

    onSubmit: async (values, { setErrors, resetForm }) => {
      const response = await register({
        variables: { options: values },
        update: (cache, { data }) => {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: "Query",
              me: data?.register.user,
            },
          });
        },
      });
      resetForm();
      if (response.data?.register.errors) {
        setErrors(toErrorMap(response.data.register.errors));
      } else if (response.data?.register.user) {
        // worked
        router.push("/");
      }
    },
  });
  return (
    <Wrapper variant="small">
      <form onSubmit={SignupFormIk.handleSubmit}>
        <InputField
          name="username"
          placeholder="username"
          label="Username"
          onChange={SignupFormIk.handleChange}
          value={SignupFormIk.values.username}
        />
        {SignupFormIk.touched.username && SignupFormIk.errors.username
          ? SignupFormIk.errors.username
          : ""}
        <Box mt={4}>
          <InputField
            name="email"
            placeholder="email"
            label="Email"
            onChange={SignupFormIk.handleChange}
            value={SignupFormIk.values.email}
          />
          {SignupFormIk.touched.email && SignupFormIk.errors.email
            ? SignupFormIk.errors.email
            : ""}
        </Box>
        <Box mt={4}>
          <InputField
            onChange={SignupFormIk.handleChange}
            value={SignupFormIk.values.password}
            name="password"
            placeholder="password"
            label="Password"
            type="password"
          />
          {SignupFormIk.touched.password && SignupFormIk.errors.password
            ? SignupFormIk.errors.password
            : ""}
        </Box>
        <Button
          mt={4}
          type="submit"
          isLoading={SignupFormIk.isSubmitting}
          variantColor={SignupFormIk.isSubmitting ? "balck " : "teal"}
        >
          {SignupFormIk.isSubmitting ? "wait seacnd " : "register"}
        </Button>
      </form>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Register);

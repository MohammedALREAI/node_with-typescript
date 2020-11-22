import React from "react";
import { Form, useFormik } from "formik";
import { Box, Button, Link, Flex } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation, MeQuery, MeDocument } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  const formLogin = useFormik<{ usernameOrEmail: string; password: string }>({
    initialValues: { usernameOrEmail: "", password: "" },
    onSubmit: async (values, { setErrors, resetForm }) => {
      const response = await login({
        variables: values,
        update: (cache, { data }) => {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: "Query",
              me: data?.login.user,
            },
          });
          cache.evict({ fieldName: "posts:{}" });
        },
      });
      resetForm();

      if (response.data?.login.errors) {
        setErrors(toErrorMap(response.data.login.errors));
      } else if (response.data?.login.user) {
        if (typeof router.query.next === "string") {
          router.push(router.query.next);
        } else {
          // worked
          router.push("/");
        }
      }
    },
  });

  return (
    <Wrapper variant="small">
      <Form onSubmit={formLogin.handleSubmit}>
        <InputField
          name="usernameOrEmail"
          placeholder="username or email"
          label="Username or Email"
          value={formLogin.values.usernameOrEmail}
          onChange={formLogin.handleChange}
        />
        {formLogin.touched.usernameOrEmail && formLogin.errors.usernameOrEmail
          ? formLogin.errors.usernameOrEmail
          : ""}
        <Box mt={4}>
          <InputField
            name="password"
            placeholder="password"
            label="Password"
            type="password"
            value={formLogin.values.password}
            onChange={formLogin.handleChange}
          />
          {formLogin.touched.password && formLogin.errors.password
            ? formLogin.errors.password
            : ""}
        </Box>
        <Flex mt={2}>
          <NextLink href="/forgot-password">
            <Link ml="auto">forgot password?</Link>
          </NextLink>
        </Flex>
        <Button
          mt={4}
          type="submit"
          isLoading={formLogin.isSubmitting}
          variantColor={formLogin.isSubmitting ? "teal" : "black"}
        >
          {formLogin.isSubmitting ? "wait second" : "login"}
        </Button>
      </Form>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);

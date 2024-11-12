"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { PasskeyModal } from "@/components/PasskeyModal";
import SubmitButton from "@/components/SubmitButton";
import { useToast } from "@/components/Toaster/Toasterprovider";
import { Form } from "@/components/ui/form";
import { login } from "@/lib/actions/patient.actions";
import { isLoggedIn } from "@/lib/auth";
import { LoginValidation } from "@/lib/validation";

const LoginComp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        email: values.email,
        password: values.password,
      };

      const newUser = await login(user);

      if (newUser && newUser?.$id) {
        addToast({
          loading: false,
          message: "User successfully register",
          type: "success",
        });
        console.log("Here eeeeeeeeeeeeeeeee", newUser);
        router.push(`/patients/${newUser?.$id}/register`);
      }
    } catch (error: any) {
      addToast({
        loading: false,
        message: error?.response?.message || "Something went wrong",
        type: "error",
      });
      console.log("herrrrrrrrrrrrrr", error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PASSWORD}
          control={form.control}
          name="password"
          label="Password"
          placeholder="Password"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

const Login = () => {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin");
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname, searchParams.get("admin"));
  useEffect(() => {
    if (isAdmin) return;
    if (pathname === "/" && isLoggedIn()) {
      router.push("/dashboard");
    } else if (
      !isLoggedIn() &&
      pathname !== "/login" &&
      pathname !== "/register"
    ) {
      router.push("/login");
    }
  }, [pathname]);

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModal />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          <LoginComp />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CarePluse
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Login;

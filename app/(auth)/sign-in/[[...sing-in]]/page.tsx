import { SignIn } from "@clerk/nextjs";

const SingInPage = () => {
  return (
    <main className="flex-center h-screen w-full">
      <SignIn />
    </main>
  );
};

export default SingInPage;

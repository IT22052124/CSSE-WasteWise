import { useMaterialTailwindController } from "@/context";
import { Spinner } from "@material-tailwind/react";

export const Loader = () => {
  const [controller] = useMaterialTailwindController();
  const { sidenavColor } = controller;

  return <Spinner className="h-16 w-16 mx-auto my-10" color={sidenavColor !== "dark" ? sidenavColor : "gray"} />;
};

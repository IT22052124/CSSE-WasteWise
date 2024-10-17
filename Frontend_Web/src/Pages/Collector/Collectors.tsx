import {
    Card,
    CardHeader,
    CardBody,
    Typography,
  } from "@material-tailwind/react";
  import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
  import { getCollectors } from "@/controllers/collectorController"; // Fetch collector data
  import { useEffect, useState } from "react";
  import { useMaterialTailwindController } from "@/context";
  
  export const Collectors = () => {
    const [collectors, setCollectors] = useState<any[]>([]);
    const [controller, dispatch] = useMaterialTailwindController();
    const { sidenavColor } = controller;
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getCollectors(); // Fetch collector data
          setCollectors(data);
        } catch (error) {
          console.error("Error fetching collectors:", error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12 min-h-screen">
        <Card>
          <CardHeader
            variant="gradient"
            color={sidenavColor !== "dark" ? sidenavColor : "gray"}
            className="mb-8 p-6"
          >
            <Typography
              variant="h6"
              color={sidenavColor !== "white" ? "white" : "grey"}
            >
              Collectors
            </Typography>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "Collector ID",
                    "Name",
                    "Email",
                    "Phone",
                    "Assigned Bins",
                    "",
                  ].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {collectors?.map(
                  ({ collectorID, name, email, phone, assignedBins }, key) => {
                    const className = `py-3 px-5 ${
                      key === collectors.length - 1 ? "" : "border-b border-blue-gray-50"
                    }`;
  
                    return (
                      <tr key={collectorID}>
                        <td className={className}>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {collectorID}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {name}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {email}
                          </Typography>
                        </td>
                        <td className={className}>
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {phone}
                          </Typography>
                        </td>
                        
                        <td className={className}>
                          <Typography
                            as="a"
                            href="#"
                            className="text-xs font-semibold text-blue-gray-600"
                          >
                            <EllipsisVerticalIcon
                              strokeWidth={2}
                              className="h-5 w-5 text-inherit"
                            />
                          </Typography>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    );
  };
  
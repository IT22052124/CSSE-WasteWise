import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
    Button,
  } from "@material-tailwind/react";
  import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
  import { useEffect, useState } from "react";
  import { getBinRequests, getDocData } from "@/controllers/BinsController";
  import { useMaterialTailwindController } from "@/context";
  import { useNavigate } from "react-router-dom";
  
  export const BinRequests = () => {
    const [binRequests, setBinRequests] = useState<any[]>([]);
    const [controller] = useMaterialTailwindController();
    const { sidenavColor } = controller;
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await getBinRequests();
  
          const resolvedRequests = await Promise.all(
            data.map(async (request) => {
              const binTypeData = await getDocData(request.binTypeId);
              const userData = await getDocData(request.userId);
              return {
                ...request,
                binType: binTypeData.binType,
                user: userData.username,
                address: userData.address,
                userEmail: userData.email,
              };
            })
          );
  
          setBinRequests(resolvedRequests);
        } catch (error) {
          console.error("Error fetching bin requests:", error);
        }
      };
  
      fetchData();
    }, []);
  
    const handleCreateBin = (binType: string, userEmail: string) => {
      // Navigate to the bin creation page with pre-filled waste type and user email
      navigate(`/dashboard/addbin?binType=${binType}&userEmail=${userEmail}`);
    };
  
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12 min-h-screen">
        <Card>
          <CardHeader
            variant="gradient"
            color={sidenavColor !== "dark" ? sidenavColor : "gray"}
            className="mb-8 p-6"
          >
            <Typography variant="h6" color={sidenavColor !== "white" ? "white" : "grey"}>
              Bin Requests
            </Typography>
          </CardHeader>
          <CardBody className="px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Request ID", "Bin Type", "User", "Address", "Capacity", "Status", "Created At", ""].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {binRequests.map(({ id, binType, user, address, capacity, status, createdAt, userEmail }, key) => {
                  const className = `py-3 px-5 ${key === binRequests.length - 1 ? "" : "border-b border-blue-gray-50"}`;
  
                  return (
                    <tr key={id}>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-500">{id}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{binType}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{user}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{address}</Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{capacity} kg</Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={status === "Pending" ? "yellow" : "green"}
                          value={status}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {new Date(createdAt.seconds * 1000).toLocaleDateString()}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Button size="sm" onClick={() => handleCreateBin(binType, userEmail)}>
                          Create Bin
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    );
  };
  
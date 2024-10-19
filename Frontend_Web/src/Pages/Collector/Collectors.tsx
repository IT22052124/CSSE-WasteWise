import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    IconButton,
  } from "@material-tailwind/react";
  import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline"; // Importing the TrashIcon
  import { getCollectors,deleteCollector  } from "@/controllers/collectorController"; // Fetch collector data
  import { useEffect, useState } from "react";
  import { useMaterialTailwindController } from "@/context";
  import { useNavigate } from "react-router-dom";
  import { toast } from 'react-toastify'; // Import toast

  export const Collectors = () => {
    const navigate = useNavigate();

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
  
    const handleDelete = async (id: string) => {
      try {
        await deleteCollector(id);
        toast.success("Collector deleted successfully!");
        navigate("/dashboard/collectors"); // Navigate to the collectors list page


        } catch (error) {
        console.error("Error deleting bin:", error);
      }
    };


    return (
      <div className="mt-12 mb-8 flex flex-col gap-12 min-h-screen">
        <Card>
          <CardHeader
            variant="gradient"
            color={sidenavColor !== "dark" ? sidenavColor : "gray"}
            className="mb-8 p-6 flex justify-between items-center"
          >
            <Typography
              variant="h6"
              color={sidenavColor !== "white" ? "white" : "grey"}
            >
              Collectors
            </Typography>
            <Button
            variant="contained"
            color={sidenavColor === "white" ? "black" : "white"}
            onClick={() => navigate(`/dashboard/addcollector`)}
          >
            Add Type
          </Button>
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
                    "action",
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
                  ({id, collectorID, name, email, phone, address }, key) => {
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
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {address}
                          </Typography>
                        </td>
                        
                        
                        <td className={className}>
                      <div className="flex items-center gap-4">
                        {/* Edit Icon */}
                        
                        {/* Delete Icon */}
                        <IconButton
                          color="red"
                          size="sm"
                          onClick={() => handleDelete(id)}
                        >
                          <TrashIcon strokeWidth={2} className="h-5 w-5" />
                        </IconButton>
                      </div>
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
  
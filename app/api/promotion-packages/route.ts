import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  // Mock data for promotion packages
  const packages = [
    {
      id: "1",
      name: "Basic Plan",
      price: 10,
      description: "Your ad will be highlighted for 7 days.",
    },
    {
      id: "2",
      name: "Premium Plan",
      price: 25,
      description:
        "Your ad will be featured for 14 days with higher visibility.",
    },
  ];

  return res.status(200).json(packages);
}

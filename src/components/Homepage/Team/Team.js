import { Card, CardContent } from "@/components/ui/Card";
import Image from "next/image";

export default function Team() {
  // Mock data for team members
  const teamMembers = [
    {
      id: 1,
      name: "Demon1",
      image: "/homepage/demon1.jpg", // replace with actual image paths or URLs
      designation: "controller/Duelist",
    },
    {
      id: 2,
      name: "Yay",
      image: "/homepage/yay.png",
      designation: "sentinel",
    },
    {
      id: 3,
      name: "Aspas",
      image: "/homepage/aspas.jpg",
      designation: "Duelist",
    },
    {
      id: 4,
      name: "Primmie",
      image: "/homepage/primmie.jpg",
      designation: "Duelist/initiator",
    },
    {
      id: 5,
      name: "Tenz",
      image: "/homepage/tenz.png",
      designation: "Controller/sentinel",
    },
  ];

  return (
    <div className="bg-white max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">Our Team</h2>
        <p className="text-gray-500 mt-2">
          The people behind your gaming experience
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 justify-items-center">
        {teamMembers.map((member) => (
          <Card key={member.id} className="w-full max-w-sm">
            <CardContent className="p-6">
              <Image
                alt={`Team Member ${member.name}`}
                className="aspect-square object-cover rounded-full mx-auto mb-4"
                height="150"
                src={member.image}
                width="150"
              />
              <h3 className="text-lg font-semibold text-center">
                {member.name}
              </h3>
              <p className="text-gray-500 text-center">{member.designation}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

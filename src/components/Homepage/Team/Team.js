"use client";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const Team = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Our Team</h2>
          <p className="text-gray-500 mt-2">
            The people behind your gaming experience
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((member) => (
            <Card key={member}>
              <CardContent className="p-6">
                <Image
                  alt={`Team Member ${member}`}
                  className="aspect-square object-cover rounded-full mx-auto mb-4"
                  height="150"
                  src="/placeholder.svg"
                  width="150"
                />
                <h3 className="text-lg font-semibold text-center">
                  Team Member {member}
                </h3>
                <p className="text-gray-500 text-center">Role</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
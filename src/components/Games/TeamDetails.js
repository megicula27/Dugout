import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function TeamDetails({ team, tournaments }) {
  return (
    <Tabs defaultValue="team" className="w-full">
      <TabsList>
        <TabsTrigger value="team">Your Team</TabsTrigger>
        <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
      </TabsList>
      <TabsContent value="team">
        <Card>
          <CardHeader>
            <CardTitle>{team.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">Team Members:</h3>
            <ul className="list-disc list-inside">
              {team.members.map((member, index) => (
                <li key={index}>{member}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tournaments">
        <Card>
          <CardHeader>
            <CardTitle>Tournaments</CardTitle>
          </CardHeader>
          <CardContent>
            {tournaments.length > 0 ? (
              <ul className="space-y-2">
                {tournaments.map((tournament) => (
                  <li
                    key={tournament.id}
                    className="flex justify-between items-center"
                  >
                    <span>{tournament.name}</span>
                    <span className="text-sm text-gray-500">
                      {tournament.date}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tournaments joined yet.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
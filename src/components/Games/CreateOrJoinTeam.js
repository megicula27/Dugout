import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui";

export default function CreateOrJoin({
  selectedGame,
  onCreateTeam,
  onJoinTeam,
}) {
  const [action, setAction] = useState(null);
  const [teamName, setTeamName] = useState("");
  const [teamUid, setTeamUid] = useState("");

  const handleActionChange = (newAction) => {
    setAction(newAction);
    setTeamName("");
    setTeamUid("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Team or Join an Existing Team</CardTitle>
      </CardHeader>
      <CardContent>
        {action === "create" ? (
          <div className="space-y-4">
            <Input
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
            <Button onClick={() => onCreateTeam(teamName, selectedGame)}>
              Create Team
            </Button>
          </div>
        ) : action === "join" ? (
          <div className="space-y-4">
            <Input
              placeholder="Enter team UID"
              value={teamUid}
              onChange={(e) => setTeamUid(e.target.value)}
            />
            <Button onClick={() => onJoinTeam(teamUid)}>Join Team</Button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Button onClick={() => handleActionChange("create")}>
              Create Team
            </Button>
            <Button onClick={() => handleActionChange("join")}>
              Join Team
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

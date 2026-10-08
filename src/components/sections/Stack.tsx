import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { skills } from "@/content/site";

export function Stack() {
  return (
    <ul className="mt-10 grid gap-4 md:grid-cols-2">
      {skills.map(({ group, items }) => (
        <li key={group}>
          <Card className="h-full">
            <h3 className="text-lg font-medium text-text">{group}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {items.map((item) => (
                <li key={item}>
                  <Badge>{item}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </li>
      ))}
    </ul>
  );
}

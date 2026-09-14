interface StatCardProps {
  title: string;
  value: number;
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <div>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default StatCard;

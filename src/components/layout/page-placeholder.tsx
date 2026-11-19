
type PagePlaceholderProps = {
  title: string;
  description: string;
};

export default function PagePlaceholder({
  title,
  description,
}: PagePlaceholderProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-bold tracking-tight">
        {title}
      </h1>

      <p className="max-w-lg text-center text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

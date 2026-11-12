export default function AuthLlayout({ children }: LayoutProps<"/">) {
  return (
   <div className="flex-center min-h-screen w-full">
    {children}
    </div>
  );
}
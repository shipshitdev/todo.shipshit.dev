import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function HomePage() {
  const { userId } = await auth();
  
  if (userId) {
    redirect('/today');
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Todoist Clone</h1>
        <p className="text-muted-foreground mb-8">Sign in to get started</p>
        <a href="/sign-in" className="text-primary hover:underline">
          Sign In
        </a>
      </div>
    </div>
  );
}


import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LogOut, 
  User, 
  GraduationCap, 
  Brain, 
  Cpu, 
  Puzzle,
} from 'lucide-react';
import ProfileEditor from '@/components/admin/ProfileEditor';
import ClassroomEditor from '@/components/admin/ClassroomEditor';
import BrainPopEditor from '@/components/admin/BrainPopEditor';
import TechieBitesEditor from '@/components/admin/TechieBitesEditor';
import TimePassEditor from '@/components/admin/TimePassEditor';

const AdminDashboard = () => {
  const [user] = useAuthState(auth);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Signed in as: {user?.email}
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="classroom" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Classroom</span>
            </TabsTrigger>
            <TabsTrigger value="brainpop" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">BrainPops</span>
            </TabsTrigger>
            <TabsTrigger value="techiebites" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span className="hidden sm:inline">TechieBites</span>
            </TabsTrigger>
            <TabsTrigger value="timepass" className="flex items-center gap-2">
              <Puzzle className="h-4 w-4" />
              <span className="hidden sm:inline">TimePass</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Edit your profile details, bio, and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="classroom">
            <Card>
              <CardHeader>
                <CardTitle>Classroom Courses</CardTitle>
                <CardDescription>
                  Manage your teaching courses and materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClassroomEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brainpop">
            <Card>
              <CardHeader>
                <CardTitle>BrainPops Quizzes</CardTitle>
                <CardDescription>
                  Manage interactive quizzes and assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BrainPopEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="techiebites">
            <Card>
              <CardHeader>
                <CardTitle>TechieBites Articles</CardTitle>
                <CardDescription>
                  Manage your tech articles and blog posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TechieBitesEditor />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timepass">
            <Card>
              <CardHeader>
                <CardTitle>TimePass Puzzles</CardTitle>
                <CardDescription>
                  Manage puzzles and brain teasers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimePassEditor />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
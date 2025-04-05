
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Clock,
  Filter,
  Search,
  ChevronRight,
  Check,
  AlertCircle,
  Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
//import { Activity, activityService } from '@/services/activityService';
// import Activities from "./pages/Activities";  
import Activity from "./pages/Activity";
import { activityService } from './ActivityService';

const Activities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const data = await activityService.getActivities();
        setActivities(data);
        setFilteredActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        toast.error("Failed to load activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    let result = activities;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(activity =>
        activity.title.includes(searchQuery)

        // activity.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      );
    }

    // Apply subject filter
    if (subjectFilter !== 'all') {
      result = result.filter(activity => activity.subject === subjectFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(activity => activity.status === statusFilter);
    }

    setFilteredActivities(result);
  }, [activities, searchQuery, subjectFilter, statusFilter]);

  // Extract unique subjects for the filter
  const subjects = ['all', ...new Set(activities.map(activity => activity.subject))];

  // Render loading skeleton
  const renderSkeleton = () => {
    return Array(5).fill(null).map((_, index) => (
      <div key={index} className="activity-card animate-pulse shimmer p-6 grid gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    ));
  };

  // Get status badge class
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <Badge variant="outline" className="status-badge status-badge-pending">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Submitted':
        return (
          <Badge variant="outline" className="status-badge status-badge-submitted">
            <Check className="h-3 w-3 mr-1" />
            Submitted
          </Badge>
        );
      case 'Graded':
        return (
          <Badge variant="outline" className="status-badge status-badge-graded">
            <Star className="h-3 w-3 mr-1" />
            Graded
          </Badge>
        );
      case 'Overdue':
        return (
          <Badge variant="outline" className="status-badge status-badge-overdue">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={true} userType="student" userName="User" />

      <main className="flex-1 py-8 animate-page-in">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <section className="mb-6">
            <div className="glass-panel rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tighter">
                    <BookOpen className="h-8 w-8 inline-block mr-3 text-primary" />
                    Activities
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage your learning activities and assignments
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6">
            {/* Filters Section */}
            <section className="animate-fade-in">
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activities..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-3">
                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects.filter(s => s !== 'all').map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="Graded">Graded</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </section>

            {/* Activities List */}
            <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="submitted">Submitted</TabsTrigger>
                  <TabsTrigger value="graded">Graded</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-0">
                  <div className="space-y-4">
                    {loading ? (
                      renderSkeleton()
                    ) : filteredActivities.length > 0 ? (
                      filteredActivities.map(activity => (
                        <Card
                          key={activity.id}
                          className="activity-card overflow-hidden hover:border-primary/40 transition-all duration-300"
                          onClick={() => navigate(`/activity/${activity.id}`)}
                        >
                          <CardContent className="p-6 grid gap-4">
                            <div className="flex flex-col">
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-lg">{activity.title}</h3>
                                {getStatusBadge(activity.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{activity.subject}</p>
                              <p className="mt-2 line-clamp-2 text-sm">{activity.description}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mt-auto">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>Due: {formatDate(activity.dueDate)}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="self-end text-primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/activity/${activity.id}`);
                                }}
                              >
                                View Details
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No activities found</h3>
                        <p className="text-muted-foreground mt-1">
                          Try adjusting your filters or search criteria
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="pending" className="mt-0">
                  <div className="space-y-4">
                    {loading ? (
                      renderSkeleton()
                    ) : filteredActivities.filter(a => a.status === 'Pending').length > 0 ? (
                      filteredActivities
                        .filter(a => a.status === 'Pending')
                        .map(activity => (
                          <Card
                            key={activity.id}
                            className="activity-card overflow-hidden hover:border-primary/40 transition-all duration-300"
                            onClick={() => navigate(`/activity/${activity.id}`)}
                          >
                            <CardContent className="p-6 grid gap-4">
                              <div className="flex flex-col">
                                <div className="flex items-start justify-between">
                                  <h3 className="font-semibold text-lg">{activity.title}</h3>
                                  {getStatusBadge(activity.status)}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{activity.subject}</p>
                                <p className="mt-2 line-clamp-2 text-sm">{activity.description}</p>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mt-auto">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>Due: {formatDate(activity.dueDate)}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="self-end text-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/activity/${activity.id}`);
                                  }}
                                >
                                  View Details
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                          <Check className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No pending activities</h3>
                        <p className="text-muted-foreground mt-1">
                          All caught up! You have no pending activities.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="submitted" className="mt-0">
                  <div className="space-y-4">
                    {loading ? (
                      renderSkeleton()
                    ) : filteredActivities.filter(a => a.status === 'Submitted').length > 0 ? (
                      filteredActivities
                        .filter(a => a.status === 'Submitted')
                        .map(activity => (
                          <Card
                            key={activity.id}
                            className="activity-card overflow-hidden hover:border-primary/40 transition-all duration-300"
                            onClick={() => navigate(`/activity/${activity.id}`)}
                          >
                            <CardContent className="p-6 grid gap-4">
                              <div className="flex flex-col">
                                <div className="flex items-start justify-between">
                                  <h3 className="font-semibold text-lg">{activity.title}</h3>
                                  {getStatusBadge(activity.status)}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{activity.subject}</p>
                                <p className="mt-2 line-clamp-2 text-sm">{activity.description}</p>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mt-auto">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>Due: {formatDate(activity.dueDate)}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="self-end text-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/activity/${activity.id}`);
                                  }}
                                >
                                  View Details
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No submitted activities</h3>
                        <p className="text-muted-foreground mt-1">
                          You haven't submitted any activities yet.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="graded" className="mt-0">
                  <div className="space-y-4">
                    {loading ? (
                      renderSkeleton()
                    ) : filteredActivities.filter(a => a.status === 'Graded').length > 0 ? (
                      filteredActivities
                        .filter(a => a.status === 'Graded')
                        .map(activity => (
                          <Card
                            key={activity.id}
                            className="activity-card overflow-hidden hover:border-primary/40 transition-all duration-300"
                            onClick={() => navigate(`/activity/${activity.id}`)}
                          >
                            <CardContent className="p-6 grid gap-4">
                              <div className="flex flex-col">
                                <div className="flex items-start justify-between">
                                  <h3 className="font-semibold text-lg">{activity.title}</h3>
                                  {getStatusBadge(activity.status)}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{activity.subject}</p>
                                <p className="mt-2 line-clamp-2 text-sm">{activity.description}</p>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mt-auto">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Star className="h-3.5 w-3.5" />
                                  <span>Grade: {activity.grade} / {activity.points}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="self-end text-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/activity/${activity.id}`);
                                  }}
                                >
                                  View Details
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                          <Star className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No graded activities</h3>
                        <p className="text-muted-foreground mt-1">
                          You don't have any graded activities yet.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="hardcoded" className="mt-0">
                  <div className="space-y-4">
                    <Card className="activity-card overflow-hidden hover:border-primary/40 transition-all duration-300">
                      <CardContent className="p-6 grid gap-4">
                        <div className="flex flex-col">
                          <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg">Hardcoded Activity Title</h3>
                            <div className="badge">Graded</div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">Subject: Hardcoded Subject</p>
                          <p className="mt-2 line-clamp-2 text-sm">This is a hardcoded description of an activity.</p>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mt-auto">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="h-3.5 w-3.5" />
                            <span>Grade: 90 / 100</span>
                          </div>
                          <Button variant="ghost" size="sm" className="self-end text-primary">
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Activities;
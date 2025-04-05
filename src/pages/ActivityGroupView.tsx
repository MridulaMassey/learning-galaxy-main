
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Filter, 
  Search,
  ChevronRight,
  Check,
  AlertCircle,
  Star,
  Plus,
  Trash2,
  Users,
  UserPlus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { classGroupActivityService } from './ClassGroupActivityService';

const ActivityGroupView = () => {
  const navigate = useNavigate();
  const [allActivities, setAllActivities] = useState<any[]>([]);
  const [groupedActivities, setGroupedActivities] = useState<Record<string, any>>({});
  const [filteredActivities, setFilteredActivities] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const data = await classGroupActivityService.getClassGroupActivities();
        console.log("The data from classGroupActivityService is:", data);
        
        setAllActivities(data);
        
        // Group activities by activityId
        const grouped = groupActivitiesByActivityId(data);
        setGroupedActivities(grouped);
        setFilteredActivities(grouped);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        toast.error("Failed to load activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Group activities by the activityId
  const groupActivitiesByActivityId = (activities: any[]) => {
    const grouped: Record<string, any> = {};
    
    activities.forEach(activity => {
      const activityId = getValue(activity, ['activityId', 'id', 'classGroupSubjectActivityId']);
      if (!activityId) return; // Skip if no valid id
      
      if (!grouped[activityId]) {
        // Create the group with the first activity's info
        grouped[activityId] = {
          activityId,
          title: getValue(activity, ['title', 'activity.title', 'activityName']),
          class: getValue(activity, ['class', 'className', 'classGroup.className']),
          subject: getValue(activity, ['subject', 'subjectName']),
          description: getValue(activity, ['description', 'activity.description']),
          dueDate: getValue(activity, ['dueDate', 'activity.dueDate', 'deadline']),
          students: []
        };
      }
      
      // Add this student to the activity's students list
      grouped[activityId].students.push({
        id: getValue(activity, ['id']),
        studentName: getValue(activity, ['studentName', 'userName', 'student.userName']),
        status: getValue(activity, ['status'], 'Pending')
      });
    });
    
    return grouped;
  };

  useEffect(() => {
    let result = { ...groupedActivities };
    
    // Apply filters
    if (searchQuery || classFilter !== 'all' || subjectFilter !== 'all' || statusFilter !== 'all') {
      result = Object.fromEntries(
        Object.entries(groupedActivities).filter(([_, activity]) => {
          const matchesSearch = !searchQuery || 
            activity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.students.some((student: any) => 
              student.studentName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
          const matchesClass = classFilter === 'all' || activity.class === classFilter;
          const matchesSubject = subjectFilter === 'all' || activity.subject === subjectFilter;
          
          // For status, check if any student has that status
          const matchesStatus = statusFilter === 'all' || 
            activity.students.some((student: any) => student.status === statusFilter);
            
          return matchesSearch && matchesClass && matchesSubject && matchesStatus;
        })
      );
    }
    
    setFilteredActivities(result);
    setCurrentPage(1);
  }, [groupedActivities, searchQuery, classFilter, subjectFilter, statusFilter]);

  // Extract unique classes and subjects
  const classes = ['all', ...new Set(allActivities
    .map(activity => activity.class || activity.className || 
      (activity.classGroup && activity.classGroup.className) || 'Unknown')
    .filter(Boolean))];
  
  const subjects = ['all', ...new Set(allActivities
    .map(activity => activity.subject || activity.subjectName || 'Unknown')
    .filter(Boolean))];

  // Pagination for grouped activities
  const activityIds = Object.keys(filteredActivities);
  const totalPages = Math.ceil(activityIds.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivityIds = activityIds.slice(startIndex, startIndex + itemsPerPage);
  
  const renderSkeleton = () => {
    return Array(3).fill(null).map((_, index) => (
      <div key={index} className="bg-background border rounded-md p-6">
        <div className="flex flex-col space-y-5">
          <div className="flex justify-between">
            <Skeleton className="h-7 w-1/3" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-5 w-1/5" />
            <Skeleton className="h-5 w-1/5" />
          </div>
          <Skeleton className="h-4 w-full" />
          <div className="mt-4 border-t pt-4">
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'Submitted':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Check className="h-3 w-3 mr-1" />
            Submitted
          </Badge>
        );
      case 'Graded':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Star className="h-3 w-3 mr-1" />
            Graded
          </Badge>
        );
      case 'Overdue':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Invalid Date') return 'Invalid Date';
    
    try {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    } catch (error) {
      console.error("Invalid date format:", error);
      return 'Invalid Date';
    }
  };

  const getValue = (activity: any, keys: string[], defaultValue: string = 'N/A') => {
    for (const key of keys) {
      if (key.includes('.')) {
        const parts = key.split('.');
        let value = activity;
        
        let valid = true;
        
        for (const part of parts) {
          if (value && value[part] !== undefined) {
            value = value[part];
          } else {
            valid = false;
            break;
          }
        }
        
        if (valid && value !== null && value !== undefined) {
          return value;
        }
      } 
      else if (activity[key] !== undefined && activity[key] !== null) {
        return activity[key];
      }
    }
    return defaultValue;
  };

  const handleDeleteActivity = async (activityId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Remove the entire activity group
      const updatedGroupedActivities = { ...groupedActivities };
      delete updatedGroupedActivities[activityId];
      setGroupedActivities(updatedGroupedActivities);
      
      // Also filter it out from allActivities
      setAllActivities(allActivities.filter(activity => 
        getValue(activity, ['activityId', 'id', 'classGroupSubjectActivityId']) !== activityId
      ));
      
      toast.success("Activity deleted successfully");
    } catch (error) {
      console.error("Failed to delete activity:", error);
      toast.error("Failed to delete activity");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header isLoggedIn={true} userType="teacher" userName="Teacher" />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <section className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <UserPlus className="h-7 w-7 text-primary" />
                  Group Activities
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage activities assigned to groups of students
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Create Group Activity
                </Button>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Saturday, April 5, 2025
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by activity title, description or student name..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <span>{classFilter === 'all' ? 'All Classes' : classFilter}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="all-classes" value="all">All Classes</SelectItem>
                      {classes.filter(c => c !== 'all').map(classItem => (
                        <SelectItem key={`class-${classItem}`} value={classItem}>{classItem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <span>{subjectFilter === 'all' ? 'All Subjects' : subjectFilter}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="all-subjects" value="all">All Subjects</SelectItem>
                      {subjects.filter(s => s !== 'all').map(subject => (
                        <SelectItem key={`subject-${subject}`} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <span>{statusFilter === 'all' ? 'All Status' : statusFilter}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="status-all" value="all">All Status</SelectItem>
                      <SelectItem key="status-pending" value="Pending">Pending</SelectItem>
                      <SelectItem key="status-submitted" value="Submitted">Submitted</SelectItem>
                      <SelectItem key="status-graded" value="Graded">Graded</SelectItem>
                      <SelectItem key="status-overdue" value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                {loading ? (
                  renderSkeleton()
                ) : paginatedActivityIds.length > 0 ? (
                  paginatedActivityIds.map(activityId => {
                    const activity = filteredActivities[activityId];
                    return (
                      <Card
                        key={`activity-group-${activityId}`}
                        className="hover:border-primary/40 transition-all duration-300"
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-xl">{activity.title}</h3>
                              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground mt-2">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Class:</span> 
                                  <span>{activity.class}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Subject:</span> 
                                  <span>{activity.subject}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">Due:</span>
                                  <span>{formatDate(activity.dueDate)}</span>
                                </div>
                              </div>
                              <p className="mt-2 mb-4 text-sm">{activity.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete activity?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will delete this activity for all assigned students. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={(e) => handleDeleteActivity(activityId, e)}
                                      className="bg-destructive text-destructive-foreground"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-primary"
                                onClick={() => navigate(`/activity-group-details/${activityId}`)}
                              >
                                View Details
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <h4 className="text-md font-medium mb-3 flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Assigned Students ({activity.students.length})
                            </h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Student Name</TableHead>
                                  <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {activity.students.map((student: any, index: number) => (
                                  <TableRow 
                                    key={`student-${student.id || index}`}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => navigate(`/teacherassignmentdetails/${activityId}?studentId=${student.id}`)}
                                  >
                                    <TableCell>{student.studentName}</TableCell>
                                    <TableCell className="text-right">
                                      {getStatusBadge(student.status)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-12 border rounded-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No activities found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try adjusting your filters or search criteria
                    </p>
                  </div>
                )}
              </div>
              
              {activityIds.length > 0 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={`page-${i+1}`}>
                          <PaginationLink 
                            isActive={currentPage === i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ActivityGroupView;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CreateActivityRequest } from "./CreateActivityRequest";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const activityFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  classGroupId: z.string().min(1, { message: "Please select a class level" }),
  teacherId: z.string().min(1, { message: "Teacher ID is required" }),
  activityName: z
    .string()
    .min(2, { message: "Activity name must be at least 2 characters long" })
    .max(50, { message: "Activity name must be less than 50 characters" }),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

const CreateActivity = () => {
  const [classLevels, setClassLevels] = useState<{ id: string; name: string }[]>([]);
  const [newClassLevel, setNewClassLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const defaultValues: Partial<ActivityFormValues> = {
    title: "",
    description: "",
    dueDate: undefined,
    classGroupId: "",
    teacherId: "F7400196-CDEB-49ED-11BA-08DD64CD7D35", // Default teacher ID
    activityName: "",
  };

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: ActivityFormValues) => {
    setIsSubmitting(true);
    console.log("Form data before submission:", data);
    
    try {
      const requestData: CreateActivityRequest = {
        title: data.title,
        description: data.description,
        activityName: data.activityName,
        dueDate: data.dueDate.toISOString(),
        classGroupId: data.classGroupId,
        teacherId: data.teacherId,
      };
      
      if (fileBase64 && fileName) {
        requestData.pdfFileBase64 = fileBase64;
        requestData.fileName = fileName;
        console.log("Including PDF file as base64 string");
      }
      
      console.log("Submitting activity with JSON structure matching C# model");
      
      const response = await fetch("https://localhost:44361/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        throw new Error(`Failed to create activity: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("API response:", result);
      
      toast.success("Activity created successfully!", {
        description: "Your new activity has been saved.",
        duration: 5000,
      });
      
      navigate("/activitiespagination");
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error("Failed to create activity", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/activities");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
      
      try {
        const base64 = await convertFileToBase64(file);
        setFileBase64(base64);
        console.log("File converted to base64 successfully:", file.name);
      } catch (error) {
        console.error("Error converting file to base64:", error);
        toast.error("Error processing file", {
          description: "Please try another file or contact support.",
        });
      }
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // useEffect(() => {
  //   const fetchClassLevels = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch("https://localhost:44361/api/classgroups");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch class levels");
  //       }
  //       const data = await response.json();

  //       const extractedClassLevels = data.map((item: { classGroupId: string; className: string }) => ({
  //         id: item.classGroupId,
  //         name: item.className,
  //       }));
        
  //       setClassLevels(extractedClassLevels);
  //     } catch (error) {
  //       console.error("Error fetching class levels:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchClassLevels();
  // }, []);
  useEffect(() => {
    const fetchClassLevels = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://localhost:44361/api/ClassGroupSubject/classgroupslist");
        if (!response.ok) {
          throw new Error("Failed to fetch class levels");
        }
        const data = await response.json();
  
        const extractedClassLevels = data.map((item: { 
          classGroupId: string; 
          classGroupClassName: string;
          classGroupSubjectId: string;
          subjectId:string;
        }) => ({
          id: item.classGroupId,
          name: item.classGroupClassName,
          subjectId: item.subjectId,

        
        }));
  
        setClassLevels(extractedClassLevels);
      } catch (error) {
        console.error("Error fetching class levels:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchClassLevels();
  }, []);
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="mb-6 group hover:bg-accent transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
          Back to Activities
        </Button>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <div className="space-y-2">
              <h1 className="text-3xl font-medium tracking-tight">Create New Activity</h1>
              <p className="text-muted-foreground">
                Design a new learning activity for your students.
              </p>
            </div>
          </motion.div>

          <div className="bg-card rounded-xl p-8 shadow-sm border">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Object-Oriented Programming" 
                            {...field} 
                            className="h-12"
                          />
                        </FormControl>
                        <FormDescription>
                          The main title of your activity
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="activityName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Activity2Project" 
                            {...field} 
                            className="h-12"
                          />
                        </FormControl>
                        <FormDescription>
                          A short name for referencing this activity
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide details about this activity..."
                            className="min-h-[120px] resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Detailed explanation of the activity and its objectives
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormItem>
                    <FormLabel>Upload PDF File</FormLabel>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="h-12"
                    />
                    <FormDescription>
                      Upload your activity document (PDF, DOC, or DOCX format)
                    </FormDescription>
                    {selectedFile && (
                      <p className="text-sm text-green-600 mt-1">
                        File selected: {selectedFile.name}
                      </p>
                    )}
                  </FormItem>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="classGroupId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Level</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Select a class level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classLevels.map((level) => (
                                <SelectItem key={level.id} value={level.id}>
                                  {level.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The grade level for this activity
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "h-12 w-full justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Select a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                                disabled={(date) => date < new Date()}
                                className="p-3 pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            When this activity is due for submission
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                </div>

                <div className="pt-6 flex justify-end space-x-4">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="h-11 px-6"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>

                  <Button 
                    type="submit"
                    className="h-11 px-6 bg-primary hover:bg-primary/90 transition-colors"
                    disabled={isSubmitting}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Saving..." : "Save Activity"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateActivity;
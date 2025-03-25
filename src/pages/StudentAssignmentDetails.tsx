import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, BookOpen, Award, FileText, Upload, Download, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

const StudentAssignmentDetails = () => {
  const navigate = useNavigate();
  const [hasFeedback, setHasFeedback] = useState(true); // For demo purposes, this would normally be false until feedback is given

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = () => {
    // In a real app, this would handle the submission process
    console.log("Assignment submission initiated");
    // You could redirect to a submission form or open a modal
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-6 group hover:bg-accent transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-[-2px] transition-transform" />
          Back
        </Button>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-medium tracking-tight">JavaScript Basics</h1>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Web Development
              </Badge>
            </div>
            <div className="flex items-center text-muted-foreground gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Course: Web Development</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-xl">Assignment Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Due Date</p>
                        <p className="text-muted-foreground">March 30, 2025</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Assigned By</p>
                        <p className="text-muted-foreground">Professor John Doe</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Assignment Description</h3>
                  <p className="text-muted-foreground">
                    This assignment is designed to help students practice JavaScript fundamentals, including variables, functions, and loops. You will be asked to solve several coding problems to improve your skills in these areas.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-3">Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    <li>Write 3 different functions to solve coding problems.</li>
                    <li>Include comments explaining the logic behind your solutions.</li>
                    <li>Submit the solution through the student portal.</li>
                  </ul>
                </div>

                <Separator />

                {hasFeedback && (
                  <>
                    <div className="bg-muted/20 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <h3 className="text-lg font-medium mb-1">Teacher Feedback</h3>
                          <p className="text-muted-foreground">
                            Great work on your solution! Your functions are well-structured and your comments clearly explain the logic. Consider optimizing the second function for better performance in future assignments.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-3">Assignment Files</h3>
                  <div className="space-y-4">
                    <div className="bg-muted/20 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Download className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Download Assignment PDF</p>
                            <p className="text-muted-foreground text-sm">Get the assignment instructions</p>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto">
                          <Button variant="secondary" className="w-full sm:w-auto">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted/20 rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Upload Your Solution</p>
                            <p className="text-muted-foreground text-sm">Submit your completed assignment</p>
                          </div>
                        </div>
                        <div className="w-full sm:w-auto">
                          <label className="cursor-pointer">
                            <Input 
                              type="file" 
                              accept=".pdf" 
                              className="hidden"
                              onChange={(e) => console.log("File selected:", e.target.files?.[0])} 
                            />
                            <Button variant="secondary" className="w-full sm:w-auto">
                              <Upload className="mr-2 h-4 w-4" />
                              Choose PDF
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Button size="lg" className="w-full sm:w-auto" onClick={handleSubmit}>
                    <FileText className="mr-2 h-4 w-4" />
                    Submit Your Assignment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentAssignmentDetails;

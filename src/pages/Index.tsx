import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Heart, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const features = [
  {
    icon: <Heart className="h-6 w-6 text-primary" />,
    title: "Interactive Activities",
    description: "Engage with digital worksheets, quizzes, and fun challenges that make learning exciting."
  },
  {
    icon: <Award className="h-6 w-6 text-primary" />,
    title: "Achievement Rewards",
    description: "Earn badges, certificates, and points as you complete activities and improve your skills."
  },
  {
    icon: <Star className="h-6 w-6 text-primary" />,
    title: "Progress Tracking",
    description: "Watch your progress grow with visual indicators and performance metrics."
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-primary" />,
    title: "Teacher Feedback",
    description: "Receive personalized feedback from teachers to help you improve."
  }
];

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Full-Page Background Image Section */}
        <section 
          className="relative overflow-hidden bg-[url('/public/testimage.png')] bg-cover bg-center h-screen"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-pink-300 opacity-50 z-[-1]" />
          <div className="container px-4 md:px-6 py-20 md:py-28">
            <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
              <span className="text-primary">Kind Heart Learning Application</span>
              </h1>
              <p className="max-w-[700px] text-lg md:text-xl text-white">
                An interactive educational platform where students and teachers connect through engaging activities and meaningful feedback.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link to="/login">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">
                Built for Better Learning
              </h2>
              <p className="mt-4 text-muted-foreground max-w-[700px] mx-auto">
                Discover the tools and features designed to make learning engaging and effective.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="bg-white/80 backdrop-blur-sm border border-border rounded-xl p-6 shadow-sm card-hover"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-primary/20 z-[-1]" />
          <div className="container px-4 md:px-6">
            <div className="glass-panel rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter">
                  Ready to Start Your Learning Journey?
                </h2>
                <p className="text-muted-foreground max-w-[600px] mx-auto">
                  Join thousands of students already improving their skills through interactive activities and personalized feedback.
                </p>
                <div className="mt-8">
                  <Button asChild size="lg" className="rounded-full px-8 btn-bounce">
                    <Link to="/login">Log In Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

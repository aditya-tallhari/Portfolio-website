'use client'

import React, { useState } from 'react';
import Image from 'next/image';

import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardDescription, CardTitle, CardFooter, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Project as ApiProject } from '@/lib/api';
import { FaGithub } from "react-icons/fa";
import { motion } from 'framer-motion';

interface ProjectCardProps {
  project: ApiProject;
  index: number;
  onImageLoad?: () => void;
}

const ProjectCard = ({ project, index, onImageLoad }: ProjectCardProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  // Resilient tech stack extraction
  const techArray: string[] = Array.isArray(project.techStack) 
    ? project.techStack 
    : Array.isArray((project as any)['techStack[]'])
      ? (project as any)['techStack[]']
      : [];

  const handleLoad = () => {
    if (!hasLoaded) {
      setHasLoaded(true);
      onImageLoad?.();
    }
  };

  return (
    <div 
      className='project-card opacity-0 relative w-[calc(100vw-3rem)] sm:w-[350px] md:w-[480px] shrink-0 snap-center rounded-3xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] p-0 shadow-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-500 overflow-hidden group'
    >
      {/* Image Section - Edge to Edge */}
      <div className='card-image-wrap flex h-48 sm:h-60 md:h-[280px] items-center justify-center bg-[#1a1a2e] relative overflow-hidden'>
        <Image
          src={project.imageUrl || project.image || 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=1200'}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 350px, 480px"
          unoptimized={false}
          onLoad={handleLoad}
          ref={(img: any) => {
            if (img && img.complete) {
              handleLoad();
            }
          }}
          className='object-cover transition-transform duration-700 group-hover:scale-110'
        />
        
        {/* Large Background Number (Moved above image for visibility) */}
        <div className="absolute bottom-2 left-4 text-6xl sm:text-8xl font-black text-white/20 pointer-events-none select-none z-10 drop-shadow-lg">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      <Card className='border-none bg-transparent shadow-none'>
        <CardHeader className="p-5 sm:p-6 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
             <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-jetbrains font-black text-[var(--accent-primary)] opacity-40">
                  {String(index + 1).padStart(2, '0')} /
                </span>
                <CardTitle className="text-xl sm:text-2xl md:text-3xl font-playfair font-black text-[var(--text-primary)] leading-tight">
                    {project.title}
                </CardTitle>
             </div>
             {project.isFeatured && (
               <Badge className="bg-[var(--accent-primary)] text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-fit shrink-0">
                 Featured
               </Badge>
             )}
          </div>
          <div className='text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-1.5 pt-2'>
            {techArray.slice(0, 6).map((tech, i) => (
              <Badge key={i} variant='outline' className="text-[9px] font-jetbrains border-[var(--border-primary)] text-[var(--text-secondary)]">
                {tech}
              </Badge>
            ))}
            {techArray.length > 6 && (
              <span className="text-[9px] font-jetbrains text-[var(--text-secondary)] opacity-40">
                +{techArray.length - 6} more
              </span>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-5 sm:p-6 pt-0 pb-3">
          <p className="text-xs sm:text-sm font-light text-[var(--text-secondary)] leading-relaxed line-clamp-3 font-jetbrains opacity-80">
            {project.description}
          </p>
        </CardContent>

        <CardFooter className='p-5 sm:p-6 pt-4 justify-between gap-3 border-t border-[var(--border-primary)]/40'>
          <div className='flex gap-2'>
            {project.links?.github && (
               <Button variant="outline" size="sm" asChild className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] bg-transparent">
                 <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                   <FaGithub size={14} className="sm:size-[16px]" />
                 </a>
               </Button>
            )}
            {project.links?.live && (
               <Button variant="outline" size="sm" asChild className="h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-full border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] bg-transparent">
                 <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                   <ExternalLink size={14} className="sm:size-[16px]" />
                 </a>
               </Button>
            )}
          </div>
          
          <Button 
             size='sm' 
             variant="default" 
             asChild
             className="bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 sm:px-6 h-8 sm:h-9"
          >
            <a href={project.links?.live || "#"} target="_blank" rel="noopener noreferrer">
              View Project
            </a>
          </Button>
        </CardFooter>
      </Card>
      
      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </div>
  )
}

export default ProjectCard

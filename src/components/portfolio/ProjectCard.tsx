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

interface ProjectCardProps {
  project: ApiProject;
  index: number;
  onImageLoad?: () => void;
}

const ProjectCard = ({ project, index, onImageLoad }: ProjectCardProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const techArray = Array.isArray(project.techStack) ? project.techStack : [];

  const handleLoad = () => {
    if (!hasLoaded) {
      setHasLoaded(true);
      onImageLoad?.();
    }
  };

  return (
    <div className='project-card relative w-[350px] md:w-[480px] shrink-0 rounded-3xl bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] p-0 shadow-xl border border-[var(--border-primary)] hover:border-[var(--accent-primary)] transition-all duration-500 overflow-hidden group'>
      {/* Image Section - Edge to Edge */}
      <div className='card-image-wrap flex h-60 md:h-[280px] items-center justify-center bg-[#1a1a2e] relative overflow-hidden'>
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
        <div className="absolute bottom-2 left-4 text-8xl font-black text-white/20 pointer-events-none select-none z-10 drop-shadow-lg">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      <Card className='border-none bg-transparent shadow-none'>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
             <span className="text-sm font-jetbrains font-black text-[var(--accent-primary)] opacity-40">
               {String(index + 1).padStart(2, '0')} /
             </span>
             <CardTitle className="text-2xl md:text-3xl font-playfair font-black text-[var(--text-primary)]">
                {project.title}
             </CardTitle>
          </div>
          <div className='text-sm text-muted-foreground flex flex-wrap items-center gap-1.5 pt-2'>
            {techArray.slice(0, 4).map((tech, i) => (
              <Badge key={i} variant='outline' className="text-[9px] font-jetbrains border-[var(--border-primary)] text-[var(--text-secondary)]">
                {tech}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-sm font-light text-[var(--text-secondary)] leading-relaxed line-clamp-3 font-jetbrains opacity-80">
            {project.description}
          </p>
        </CardContent>

        <CardFooter className='justify-between gap-3 pt-4 border-t border-[var(--border-primary)]/40'>
          <div className='flex gap-2'>
            {project.links?.github && (
               <Button variant="outline" size="sm" asChild className="h-9 w-9 p-0 rounded-full border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] bg-transparent">
                 <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                   <FaGithub size={16} />
                 </a>
               </Button>
            )}
            {project.links?.live && (
               <Button variant="outline" size="sm" asChild className="h-9 w-9 p-0 rounded-full border-[var(--border-primary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] bg-transparent">
                 <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                   <ExternalLink size={16} />
                 </a>
               </Button>
            )}
          </div>
          
          <Button 
             size='sm' 
             variant="default" 
             asChild
             className="bg-[var(--text-primary)] text-[var(--bg-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest px-6"
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

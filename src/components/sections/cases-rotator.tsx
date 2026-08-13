"use client";

import { useEffect, useState } from "react";

import type { Project } from "@/types/project";

import { ProjectCard } from "@/components/ui/project-card";

const VISIBLE_COUNT = 2;

function shuffle(projects: Project[]): Project[] {
  return projects
    .map((project) => ({ project, sortKey: Math.random() }))
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ project }) => project);
}

interface CasesRotatorProps {
  projects: Project[];
}

export function CasesRotator({ projects }: CasesRotatorProps) {
  const [order, setOrder] = useState(projects);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrder(shuffle(projects));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = order.slice(0, VISIBLE_COUNT);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {visible.map((project, index) => (
        <ProjectCard key={project.slug} project={project} index={index} />
      ))}
    </div>
  );
}


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Sheet } from '../../types/sheet';
import { toast } from 'sonner';

interface ProjectManagementProps {
  activeSheet: Sheet;
  onUpdateSheet: (sheetId: string, updates: Partial<Sheet>) => void;
}

interface Task {
  id: string;
  name: string;
  duration: number;
  startDate: Date;
  endDate: Date;
  dependencies: string[];
  progress: number;
  assignee: string;
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({
  activeSheet,
  onUpdateSheet
}) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'T1',
      name: 'Project Planning',
      duration: 5,
      startDate: new Date(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      dependencies: [],
      progress: 100,
      assignee: 'PM'
    },
    {
      id: 'T2',
      name: 'Design Phase',
      duration: 10,
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      dependencies: ['T1'],
      progress: 75,
      assignee: 'Designer'
    },
    {
      id: 'T3',
      name: 'Development',
      duration: 20,
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      dependencies: ['T2'],
      progress: 30,
      assignee: 'Developer'
    },
    {
      id: 'T4',
      name: 'Testing',
      duration: 7,
      startDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
      dependencies: ['T3'],
      progress: 0,
      assignee: 'QA'
    },
    {
      id: 'T5',
      name: 'Deployment',
      duration: 3,
      startDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      dependencies: ['T4'],
      progress: 0,
      assignee: 'DevOps'
    }
  ]);

  const createGanttChart = () => {
    const newCells = { ...activeSheet.cells };
    
    // Headers
    newCells['A1'] = { value: 'Project Gantt Chart' };
    newCells['A3'] = { value: 'Task ID' };
    newCells['B3'] = { value: 'Task Name' };
    newCells['C3'] = { value: 'Duration (Days)' };
    newCells['D3'] = { value: 'Start Date' };
    newCells['E3'] = { value: 'End Date' };
    newCells['F3'] = { value: 'Progress (%)' };
    newCells['G3'] = { value: 'Assignee' };
    newCells['H3'] = { value: 'Dependencies' };
    
    // Timeline headers (next 30 days)
    const startCol = 73; // Column I (73 = 'I'.charCodeAt(0))
    for (let day = 0; day < 30; day++) {
      const col = String.fromCharCode(startCol + day);
      const date = new Date(Date.now() + day * 24 * 60 * 60 * 1000);
      newCells[`${col}3`] = { value: date.toLocaleDateString() };
    }
    
    // Task data
    tasks.forEach((task, index) => {
      const row = 4 + index;
      
      newCells[`A${row}`] = { value: task.id };
      newCells[`B${row}`] = { value: task.name };
      newCells[`C${row}`] = { value: task.duration.toString() };
      newCells[`D${row}`] = { value: task.startDate.toLocaleDateString() };
      newCells[`E${row}`] = { value: task.endDate.toLocaleDateString() };
      newCells[`F${row}`] = { value: task.progress.toString() };
      newCells[`G${row}`] = { value: task.assignee };
      newCells[`H${row}`] = { value: task.dependencies.join(', ') };
      
      // Gantt bars
      const taskStartDay = Math.floor((task.startDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      const taskEndDay = Math.floor((task.endDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
      
      for (let day = 0; day < 30; day++) {
        const col = String.fromCharCode(startCol + day);
        
        if (day >= taskStartDay && day <= taskEndDay) {
          // Progress bar representation
          const progressChar = day <= taskStartDay + (task.duration * task.progress / 100) ? '█' : '░';
          newCells[`${col}${row}`] = { 
            value: progressChar,
            format: {
              backgroundColor: task.progress === 100 ? '#22c55e' : 
                              day <= taskStartDay + (task.duration * task.progress / 100) ? '#3b82f6' : '#e5e7eb'
            }
          };
        }
      }
    });
    
    // Project summary
    const summaryRow = 4 + tasks.length + 2;
    newCells[`A${summaryRow}`] = { value: 'Project Summary' };
    newCells[`A${summaryRow + 1}`] = { value: 'Total Tasks' };
    newCells[`B${summaryRow + 1}`] = { value: tasks.length.toString() };
    newCells[`A${summaryRow + 2}`] = { value: 'Completed Tasks' };
    newCells[`B${summaryRow + 2}`] = { value: tasks.filter(t => t.progress === 100).length.toString() };
    newCells[`A${summaryRow + 3}`] = { value: 'Overall Progress' };
    const overallProgress = tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length;
    newCells[`B${summaryRow + 3}`] = { value: overallProgress.toFixed(1) + '%' };
    
    // Critical path analysis
    newCells[`A${summaryRow + 5}`] = { value: 'Critical Path' };
    const criticalPath = tasks.filter(t => t.dependencies.length === 0 || t.progress < 100);
    newCells[`B${summaryRow + 5}`] = { value: criticalPath.map(t => t.id).join(' → ') };
    
    onUpdateSheet(activeSheet.id, { cells: newCells });
    toast.success("Gantt chart created successfully!");
  };

  const createResourceAllocation = () => {
    const newCells = { ...activeSheet.cells };
    
    newCells['A1'] = { value: 'Resource Allocation Matrix' };
    newCells['A3'] = { value: 'Resource' };
    
    // Get unique assignees
    const assignees = [...new Set(tasks.map(t => t.assignee))];
    assignees.forEach((assignee, index) => {
      const col = String.fromCharCode(66 + index); // B, C, D, etc.
      newCells[`${col}3`] = { value: assignee };
    });
    
    // Week headers
    for (let week = 0; week < 8; week++) {
      const row = 4 + week;
      newCells[`A${row}`] = { value: `Week ${week + 1}` };
      
      assignees.forEach((assignee, index) => {
        const col = String.fromCharCode(66 + index);
        // Calculate workload for this assignee in this week
        const workload = tasks.filter(t => t.assignee === assignee && t.progress < 100).length * 10;
        newCells[`${col}${row}`] = { 
          value: workload.toString() + '%',
          format: {
            backgroundColor: workload > 80 ? '#ef4444' : workload > 60 ? '#f59e0b' : '#22c55e'
          }
        };
      });
    }
    
    onUpdateSheet(activeSheet.id, { cells: newCells });
    toast.success("Resource allocation matrix created!");
  };

  const createTaskDependencies = () => {
    const newCells = { ...activeSheet.cells };
    
    newCells['A1'] = { value: 'Task Dependencies Matrix' };
    newCells['A3'] = { value: 'From\\To' };
    
    // Create headers for both axes
    tasks.forEach((task, index) => {
      const col = String.fromCharCode(66 + index);
      const row = 4 + index;
      newCells[`${col}3`] = { value: task.id };
      newCells[`A${row}`] = { value: task.id };
    });
    
    // Fill dependency matrix
    tasks.forEach((task, rowIndex) => {
      tasks.forEach((dependentTask, colIndex) => {
        const row = 4 + rowIndex;
        const col = String.fromCharCode(66 + colIndex);
        
        const hasDependency = dependentTask.dependencies.includes(task.id);
        newCells[`${col}${row}`] = { 
          value: hasDependency ? '1' : '0',
          format: {
            backgroundColor: hasDependency ? '#3b82f6' : '#f3f4f6',
            color: hasDependency ? 'white' : 'black'
          }
        };
      });
    });
    
    onUpdateSheet(activeSheet.id, { cells: newCells });
    toast.success("Task dependencies matrix created!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Management Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button onClick={createGanttChart} variant="outline">
            Create Gantt Chart
          </Button>
          
          <Button onClick={createResourceAllocation} variant="outline">
            Resource Allocation
          </Button>
          
          <Button onClick={createTaskDependencies} variant="outline">
            Task Dependencies
          </Button>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium mb-2">Current Project Status</h4>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <span className="font-medium">{task.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({task.assignee})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <span className="text-sm w-12">{task.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectManagement;

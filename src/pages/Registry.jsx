/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Filter,
    TreePine,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    CheckCircle2,
    Clock,
    AlertCircle,
    ShieldCheck,
    MapPin,
    Calendar,
    FileText
} from 'lucide-react';
import { apihost, methodology } from '@/components/contract/address';

const Registry = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [methodologyFilter, setMethodologyFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProjects, setTotalProjects] = useState(0);
    const [projectsPerPage, setProjectsPerPage] = useState(10);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, [currentPage, projectsPerPage]);

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${apihost}/project/getallprojects?page=${currentPage}&limit=${projectsPerPage}`
            );
            if (!response.ok) throw new Error('Failed to fetch projects');
            const data = await response.json();

            if (data && data.projects) {
                setProjects(data.projects);
                if (data.pagination) {
                    setTotalPages(data.pagination.totalPages);
                    setTotalProjects(data.pagination.totalProjects);
                    setHasNextPage(data.pagination.hasNextPage);
                    setHasPrevPage(data.pagination.hasPrevPage);
                }
            }
        } catch (error) {
            console.error('Error fetching registry projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.projectId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.projectContract?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMethodology = methodologyFilter === 'all' || project.methodology === methodologyFilter;

        let matchesStatus = true;
        if (statusFilter === 'approved') matchesStatus = project.isApproved;
        else if (statusFilter === 'validated-verified') matchesStatus = (project.isValidated && project.isVerified && !project.isApproved);
        else if (statusFilter === 'pending') matchesStatus = (!project.isValidated || !project.isVerified);

        return matchesSearch && matchesMethodology && matchesStatus;
    });

    const getStatusBadge = (project) => {
        if (project.isApproved) {
            return (
                <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Approved
                </Badge>
            );
        }
        if (project.isValidated && project.isVerified) {
            return (
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    VERRA/GOLD STANDARD
                </Badge>
            );
        }
        return (
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Pending
            </Badge>
        );
    };

    const handleReset = () => {
        setSearchTerm('');
        setMethodologyFilter('all');
        setStatusFilter('all');
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Project Registry</h1>
                        <p className="mt-2 text-gray-600 max-w-2xl">
                            A comprehensive directory of all carbon credit projects currently listed on the BiCO₂ platform, including their verification status and impact details.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {totalProjects} Total Projects
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Filters */}
                    <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-blue-600" />
                                    Filters
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleReset}
                                    className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                    Reset All
                                </Button>
                            </div>

                            <div className="space-y-5">
                                {/* Search */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Search</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            placeholder="Project ID / Address"
                                            className="pl-9 h-10 border-gray-200 focus:ring-blue-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Methodology */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Methodology</label>
                                    <Select value={methodologyFilter} onValueChange={setMethodologyFilter}>
                                        <SelectTrigger className="h-10 border-gray-200">
                                            <SelectValue placeholder="All Methodologies" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Methodologies</SelectItem>
                                            {methodology.map((m, idx) => (
                                                <SelectItem key={idx} value={idx.toString()}>
                                                    {m.length > 30 ? m.substring(0, 30) + '...' : m}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</label>
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="h-10 border-gray-200">
                                            <SelectValue placeholder="All Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="validated-verified">Gold Standard/Verra</SelectItem>
                                            <SelectItem value="pending">Pending Review</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Info Card */}
                                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2 mb-2">
                                        <AlertCircle className="w-4 h-4 text-blue-600" />
                                        Registry Info
                                    </h4>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        Carbon credits are only issued once a project reaches "Approved" status. Verified projects are registered but awaiting final issuance approval.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content - Table */}
                    <main className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/50">
                                    <TableRow>
                                        <TableHead className="w-[120px] font-semibold">Project ID</TableHead>
                                        <TableHead className="min-w-[200px] font-semibold">Methodology</TableHead>
                                        <TableHead className="w-[150px] font-semibold">Status</TableHead>
                                        <TableHead className="w-[120px] font-semibold text-right">Total Sup (tCO₂)</TableHead>
                                        <TableHead className="w-[120px] font-semibold text-right">Minted (tCO₂)</TableHead>
                                        <TableHead className="w-[80px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><div className="h-4 bg-gray-100 rounded animate-pulse w-20"></div></TableCell>
                                                <TableCell><div className="h-4 bg-gray-100 rounded animate-pulse w-40"></div></TableCell>
                                                <TableCell><div className="h-4 bg-gray-100 rounded animate-pulse w-24"></div></TableCell>
                                                <TableCell><div className="h-4 bg-gray-100 rounded animate-pulse w-16 ml-auto"></div></TableCell>
                                                <TableCell><div className="h-4 bg-gray-100 rounded animate-pulse w-16 ml-auto"></div></TableCell>
                                                <TableCell><div className="h-8 bg-gray-100 rounded animate-pulse w-8 font-auto"></div></TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredProjects.length > 0 ? (
                                        filteredProjects.map((project) => (
                                            <TableRow key={project.projectContract} className="group hover:bg-gray-50/50 transition-colors">
                                                <TableCell className="font-medium text-gray-900">
                                                    {project.projectId || 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-gray-700 line-clamp-1">
                                                            {methodology[Number(project.methodology)] || 'Unknown'}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
                                                            <MapPin className="w-2 px-0 h-2" />
                                                            {project.location ? (project.location.length > 20 ? project.location.substring(0, 20) + '...' : project.location) : 'N/A'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getStatusBadge(project)}</TableCell>
                                                <TableCell className="text-right text-gray-700">
                                                    {Number(project.credits).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right text-gray-900 font-semibold">
                                                    {Number(project.totalSupply).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => navigate(`/ProjectDetails/${project.projectContract}`)}
                                                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-full"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                                        <FileText className="w-6 h-6 text-gray-300" />
                                                    </div>
                                                    <div className="text-gray-500 font-medium">No projects found matching your criteria</div>
                                                    <Button variant="outline" size="sm" onClick={handleReset}>Clear all filters</Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination controls */}
                        <div className="mt-auto border-t border-gray-100 bg-gray-50/30 p-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <span className="text-xs font-medium text-gray-500">
                                    Showing {((currentPage - 1) * projectsPerPage) + 1} to{' '}
                                    {Math.min(currentPage * projectsPerPage, totalProjects)} of{' '}
                                    {totalProjects} registries
                                </span>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1 || isLoading}
                                        className="h-8 px-3 border-gray-200"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Previous
                                    </Button>
                                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-xs">
                                        <span className="text-xs font-bold px-1 text-blue-600">{currentPage}</span>
                                        <span className="text-xs text-gray-400">/</span>
                                        <span className="text-xs text-gray-600 px-1">{totalPages}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages || isLoading}
                                        className="h-8 px-3 border-gray-200"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Registry;

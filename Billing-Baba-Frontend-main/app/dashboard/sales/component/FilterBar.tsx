"use client";
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { DateRange } from "react-day-picker";
import { fetchUsers } from "@/lib/api";

// Shadcn UI
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
    onFilterChange: (filters: any) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
    // Options
    const dateRangeOptions = ['All Time', 'Today', 'This Week', 'This Month', 'This Year', 'Custom'];
    const godownOptions = ['All Godown', 'Main Location'];
    const statusOptions = ['All Status', 'Paid', 'Overdue', 'Unpaid'];

    // State
    const [dateOption, setDateOption] = useState('All Time');
    const [customDate, setCustomDate] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
    });

    const [users, setUsers] = useState<{ _id: string, name: string }[]>([]);
    const [selectedUser, setSelectedUser] = useState('All Users');

    const [selectedGodown, setSelectedGodown] = useState('All Godown');
    const [selectedStatus, setSelectedStatus] = useState('All Status');

    // Fetch Users on Mount
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data);
            } catch (err) {
                console.error("Failed to load users", err);
            }
        };
        loadUsers();
    }, []);

    // Track previous filters to avoid unnecessary updates
    const prevFiltersRef = React.useRef<string>('');

    // Calculate Dates and Notify Parent
    useEffect(() => {
        const filters: any = {};

        // 1. Date Logic
        let start: Date | undefined;
        let end: Date | undefined;
        const now = new Date();

        switch (dateOption) {
            case 'Today':
                start = startOfDay(now);
                end = endOfDay(now);
                break;
            case 'This Week':
                start = startOfWeek(now, { weekStartsOn: 1 });
                end = endOfWeek(now, { weekStartsOn: 1 });
                break;
            case 'This Month':
                start = startOfMonth(now);
                end = endOfMonth(now);
                break;
            case 'This Year':
                start = startOfYear(now);
                end = endOfYear(now);
                break;
            case 'Custom':
                start = customDate?.from;
                end = customDate?.to;
                break;
            case 'All Time':
            default:
                start = undefined;
                end = undefined;
                break;
        }

        if (start) filters.startDate = start.toISOString();
        if (end) filters.endDate = end.toISOString();

        // 2. Other Filters
        if (selectedUser !== 'All Users') {
            filters.userId = selectedUser;
        }

        if (selectedGodown !== 'All Godown') filters.godown = selectedGodown;
        if (selectedStatus !== 'All Status') filters.status = selectedStatus;

        // Only propagate if changed
        const filtersString = JSON.stringify(filters);
        if (prevFiltersRef.current !== filtersString) {
            prevFiltersRef.current = filtersString;
            onFilterChange(filters);
        }

    }, [dateOption, customDate, selectedUser, selectedGodown, selectedStatus, users]);

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-500 mr-2">Filter by :</span>

            {/* Date Option */}
            <div className="flex items-center bg-blue-50 rounded-full p-1 border border-blue-100">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 px-3 text-sm font-medium text-slate-700 hover:bg-blue-100 rounded-full">
                            {dateOption} <ChevronDown size={14} className="ml-2 text-slate-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup value={dateOption} onValueChange={setDateOption}>
                            {dateRangeOptions.map(opt => (
                                <DropdownMenuRadioItem key={opt} value={opt}>{opt}</DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-4 w-[1px] bg-blue-200 mx-1"></div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" className="h-8 px-3 text-sm font-medium text-slate-700 hover:bg-blue-100 rounded-full">
                            <CalendarIcon className="mr-2 h-3.5 w-3.5 text-slate-500" />
                            {customDate?.from ? (
                                customDate.to ? (
                                    <>{format(customDate.from, "dd/MM/yyyy")} To {format(customDate.to, "dd/MM/yyyy")}</>
                                ) : format(customDate.from, "dd/MM/yyyy")
                            ) : <span>Pick date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={customDate?.from}
                            selected={customDate}
                            onSelect={(range) => {
                                setCustomDate(range);
                                setDateOption('Custom'); // Auto-switch to custom on manual pick
                            }}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* User Combobox */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="h-10 px-4 text-sm justify-between font-medium min-w-[150px] rounded-full bg-blue-50 border-blue-100 text-black hover:bg-blue-100 hover:text-black">
                        {selectedUser === 'All Users'
                            ? 'All Users'
                            : users.find((u) => u._id === selectedUser)?.name || 'Select User'}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-black" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 bg-white">
                    <Command className="text-gray-900 bg-white">
                        <CommandInput placeholder="Search user..." className="text-gray-900 placeholder:text-gray-400" />
                        <CommandEmpty className="text-gray-900 py-2 px-4 text-sm">No user found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                                value="All Users"
                                onSelect={() => {
                                    setSelectedUser("All Users");
                                }}
                                className="text-black cursor-pointer hover:bg-gray-100"
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4 text-black",
                                        selectedUser === "All Users" ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                All Users
                            </CommandItem>
                            {users.map((user) => (
                                <CommandItem
                                    key={user._id}
                                    value={user.name}
                                    onSelect={() => {
                                        setSelectedUser(user._id);
                                    }}
                                    className="text-black cursor-pointer hover:bg-gray-100"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4 text-black",
                                            selectedUser === user._id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {user.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Godown Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10 px-4 text-sm justify-between font-medium min-w-[100px] rounded-full bg-blue-50 border-blue-100 text-slate-700 hover:bg-blue-100 hover:text-slate-800">
                        {selectedGodown} <ChevronDown size={14} className="ml-2 text-slate-500" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={selectedGodown} onValueChange={setSelectedGodown}>
                        {godownOptions.map(opt => (
                            <DropdownMenuRadioItem key={opt} value={opt}>{opt}</DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Status Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10 px-4 text-sm justify-between font-medium min-w-[100px] rounded-full bg-blue-50 border-blue-100 text-slate-700 hover:bg-blue-100 hover:text-slate-800">
                        {selectedStatus} <ChevronDown size={14} className="ml-2 text-slate-500" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuRadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
                        {statusOptions.map(opt => (
                            <DropdownMenuRadioItem key={opt} value={opt}>{opt}</DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
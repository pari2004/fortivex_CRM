content = """# Redesign Ad-Hoc Tasks Modal

We will completely revamp the existing `AdHocTasksModal` (which opens when clicking "+ Add" in Work Pipeline/Dashboard) to match the professional SaaS CRM aesthetic from your reference image, while ensuring it is fully functional and hooked up to the existing CRM data.

## Proposed Changes

### [MODIFY] src/components/dashboard/modals/AdHocTasksModal.tsx
We will overhaul this file to implement the exact design requested.
- **Header:** Title, Subtitle, and Close button aligned correctly.
- **Summary Cards:** Calculate and display "Total Tasks", "Today", "Pending", and "Completed" dynamically using existing `tasks` from `useCRM`.
- **Tabs:** Create functional filter tabs (All, Ad-hoc Tasks, Lead Tasks, Today, Overdue, Upcoming, Completed) with active state indicators.
- **Task Creation Section:** Create a clean input form. The primary button will open an inline dropdown/form for selecting Lead, Assignee, Priority, Date, and Time to create a complete task object, ensuring we don't break CRM schema requirements.
- **Filters/Search/Sort Bar:** Implement Search, Filter Dropdown, and Sort Dropdown to refine the task list dynamically.
- **Task List & Pagination:** Display tasks in horizontal CRM cards matching the reference. Implement the checkbox to quickly mark complete, and the three-dot `ActionMenu` for View, Edit, Complete, and Delete. Pagination will be implemented below the list (e.g. 10 per page).
- **Status & Priority Badges:** Add styled badges (Pending, Completed, Overdue) and priority flags (Low, Medium, High).

### [MODIFY] src/components/dashboard/tabs/AdminDashboardDefault.tsx (If needed)
Ensure the trigger properly opens the new full-screen/centered modal without overlapping issues. No changes to actual CRM data, just the trigger if necessary.

## Open Questions

> [!IMPORTANT]
> The reference design shows a single input line for creating a task ("e.g. Remind me to call Sarah..."), but your prompt mentions requiring fields like "Assign To, Related Lead, Priority, Date, Time, etc." when creating a task. 
> **Question:** Should clicking the "Create Task" button expand an inline form containing these extra fields below the input bar, or should it open the existing `CreateAdHocTaskModal` that already handles these fields? I propose opening the inline form right below the input for a smoother UX.

## Verification Plan

### Manual Verification
1. Open the Dashboard -> Work Pipeline -> click "+ Add".
2. Verify the new layout perfectly matches the visual reference.
3. Type a task title, fill in the details, and create the task. Verify it immediately appears in the list.
4. Test filtering (tabs, search, sort).
5. Test the action menu (delete, complete).
6. Verify pagination works when there are more than 10 tasks.
7. Verify all badges (priority, status) apply correct styling based on their values.
"""
with open("/Users/pavan.s.h/.gemini/antigravity-ide/brain/44871bd6-aa08-481d-bdba-2e6c5cc5cb08/implementation_plan.md", "w") as f:
    f.write(content)

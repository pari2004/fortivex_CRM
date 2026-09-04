const fs = require('fs');
const file = 'src/contexts/CRMContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// import useAuth in CRMProvider
if (!content.includes("useAuth")) {
  content = content.replace(
    "import { CRMProperty, defaultPropertiesData } from '@/lib/data/propertiesData';",
    "import { CRMProperty, defaultPropertiesData } from '@/lib/data/propertiesData';\nimport { useAuth } from '@/contexts/AuthContext';"
  );
}

// Extract canViewUser hook inside CRMProvider
if (!content.includes("const { canViewUser }")) {
  content = content.replace(
    "const [doNotTrackRecords, setDoNotTrackRecords] = useState<DoNotTrackRecord[]>([]);",
    "const [doNotTrackRecords, setDoNotTrackRecords] = useState<DoNotTrackRecord[]>([]);\n\n  const { canViewUser } = useAuth();"
  );
}

// We want to export scoped versions of lists, leads, tasks, calls, videoCalls, deals
// So we create scoped variables.

const createScoped = `  const scopedLeads = useMemo(() => leads.filter(l => canViewUser(l.counselor) || canViewUser(l.owner)), [leads, canViewUser]);
  const scopedTasks = useMemo(() => tasks.filter(t => canViewUser(t.assignedTo) || canViewUser(t.owner)), [tasks, canViewUser]);
  const scopedCalls = useMemo(() => calls.filter(c => canViewUser(c.caller) || canViewUser(c.handledBy) || canViewUser(c.counselor)), [calls, canViewUser]);
  const scopedDeals = useMemo(() => deals.filter(d => canViewUser(d.owner)), [deals, canViewUser]);`;

if (!content.includes("const scopedLeads = ")) {
  content = content.replace(
    "return (",
    createScoped + "\n\n  return ("
  );
}

// Now replace the values in the provider context map
content = content.replace(
  "videoCalls, lists, distributions, uploads, leads, applications, students, calls, demos, documents, businessLeads,",
  "videoCalls, lists, distributions, uploads, leads: scopedLeads, applications, students, calls: scopedCalls, demos, documents, businessLeads,"
);

content = content.replace(
  "properties, quotes, quotationDefaults, payments, tasks, users, systemUsers, reports, reminders, doNotTrackRecords,",
  "properties, quotes, quotationDefaults, payments, tasks: scopedTasks, users, systemUsers, reports, reminders, doNotTrackRecords,"
);

content = content.replace(
  "documentCategoriesTree, updateDocumentCategoriesTree,\n      deals,",
  "documentCategoriesTree, updateDocumentCategoriesTree,\n      deals: scopedDeals,"
);

fs.writeFileSync(file, content);
console.log("Updated CRMContext with data scoping");

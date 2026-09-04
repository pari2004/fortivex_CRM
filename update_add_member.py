import re

with open('src/app/customization/roles-permissions/page.tsx', 'r') as f:
    content = f.read()

# 1. Add UserPlus to imports if not there
if 'UserPlus' not in content:
    content = content.replace("ShieldCheck, Users, Edit, Copy,", "ShieldCheck, Users, Edit, Copy, UserPlus,")
else:
    # It's already there in the lucide-react import
    pass

# 2. Add form state for new member
state_add = """  const [searchUser, setSearchUser] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [newMemberData, setNewMemberData] = useState({ name: '', email: '', department: 'General', phone: '' });"""
content = re.sub(r"const \[searchUser.*?\n.*?const \[selectedUsers.*?;", state_add, content, flags=re.DOTALL)

# 3. Add handleAddNewMember function
handle_add = """  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddNewMember = () => {
    if (selectedRole && newMemberData.name && newMemberData.email) {
      const newUser = {
        id: `USR-${Math.floor(Math.random() * 10000)}`,
        name: newMemberData.name,
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMemberData.name)}&background=random`,
        department: newMemberData.department,
        email: newMemberData.email,
        phone: newMemberData.phone,
        status: 'Active'
      };
      
      // We would ideally add this to a global SYSTEM_USERS state, 
      // but here we can just push to SYSTEM_USERS for mock purposes
      SYSTEM_USERS.push(newUser);
      
      const updatedData = localData.map(r => {
        if (r.id === selectedRole.id) {
          const updatedUsers = [...(r.users || []), newUser];
          return { ...r, users: updatedUsers, userCount: updatedUsers.length };
        }
        return r;
      });
      setLocalData(updatedData);
      showToast(`Member ${newUser.name} added to ${selectedRole.name} successfully`);
      closeModal();
      setNewMemberData({ name: '', email: '', department: 'General', phone: '' });
    } else {
      showToast('Please fill in required fields', 'error');
    }
  };"""
content = re.sub(r"const toggleUserSelection.*?};", handle_add, content, flags=re.DOTALL)

# 4. Add Add New Member to ActionMenu
action_menu = """{ label: 'Manage Permissions', icon: <ShieldCheck size={16}/>, onClick: () => { setActiveMenuId(null); setSelectedRole(r); setTempPermissions(r.permissions ? JSON.parse(JSON.stringify(r.permissions)) : {}); openModal('permissions', r); } },
                    { label: 'Add New Member', icon: <UserPlus size={16}/>, onClick: () => { setActiveMenuId(null); openModal('addMember', r); } },
                    { label: 'Assign Existing Users', icon: <Users size={16}/>, onClick: () => { setActiveMenuId(null); openModal('assign', r); } },"""
content = content.replace("{ label: 'Manage Permissions', icon: <ShieldCheck size={16}/>, onClick: () => { setActiveMenuId(null); setSelectedRole(r); setTempPermissions(r.permissions ? JSON.parse(JSON.stringify(r.permissions)) : {}); openModal('permissions', r); } },\n                    { label: 'Assign Users', icon: <Users size={16}/>, onClick: () => { setActiveMenuId(null); openModal('assign', r); } },", action_menu)

# 5. Add quick action button on the card near User Count
quick_action = """<div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="var(--primary-color)" /> {r.userCount || 0}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); openModal('addMember', r); }} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <UserPlus size={12} /> Add
                  </button>
                </div>"""
content = content.replace("""<div style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="var(--primary-color)" /> {r.userCount || 0}
                </div>""", quick_action)


# 6. Add the Add Member Modal UI
add_member_modal = """
      {/* Add New Member Modal */}
      <SlidePanel isOpen={activeModal === 'addMember'} onClose={closeModal} title={`Add Member to ${selectedRole?.name}`} subtitle="Create a new user and assign them to this role" icon={<UserPlus />}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
          <PremiumCard title="Member Details" icon={<User size={18} />}>
            <PremiumInput label="Full Name" value={newMemberData.name} onChange={(e) => setNewMemberData({...newMemberData, name: e.target.value})} placeholder="e.g. Jane Doe" required />
            <PremiumInput label="Email Address" value={newMemberData.email} onChange={(e) => setNewMemberData({...newMemberData, email: e.target.value})} placeholder="e.g. jane@fortivex.com" type="email" required />
            <PremiumInput label="Phone Number" value={newMemberData.phone} onChange={(e) => setNewMemberData({...newMemberData, phone: e.target.value})} placeholder="e.g. +1 234 567 890" />
            <PremiumSelect label="Department" value={newMemberData.department} onChange={(e) => setNewMemberData({...newMemberData, department: e.target.value})} options={['General', 'Sales', 'Marketing', 'Admissions', 'HR', 'Management', 'IT']} />
          </PremiumCard>
          
          <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', gap: '12px' }}>
            <ShieldCheck size={24} color="var(--primary-color)" style={{ flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: '0 0 4px 0', color: 'var(--primary-color)', fontSize: '0.95rem' }}>Role Inheritance</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                This new member will automatically inherit all permissions configured for the <strong>{selectedRole?.name}</strong> role. Any future changes to this role's permissions will also apply to this member.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button className="secondary-btn" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
            <button className="primary-btn" style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleAddNewMember}>
              <UserPlus size={18} /> Create & Assign Member
            </button>
          </div>
        </div>
      </SlidePanel>
"""

content = content.replace("{/* Assign Users Modal */}", add_member_modal + "\n      {/* Assign Users Modal */}")

with open('src/app/customization/roles-permissions/page.tsx', 'w') as f:
    f.write(content)

print("Updated add member functionality.")

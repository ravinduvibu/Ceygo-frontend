const fs = require('fs');

const files = [
  'src/app/admin/page.tsx',
  'src/app/usermanagement/page.tsx',
  'src/app/verification/page.tsx',
  'src/app/settings/admin/page.tsx'
];

for(let f of files) {
  let content = fs.readFileSync(f, 'utf8');
  
  // Add Star to lucide-react import list using naive insertion next to Settings if it does not exist
  if(!content.includes('Star,')) {
    content = content.replace('Settings,', 'Settings,\n    Star,');
  }

  // Insert the "Verified Reviews" navigation link
  if(!content.includes('"Verified Reviews"')) {
    // Mode 1: admin/page.tsx and settings/admin
    if(content.includes('label: "Settings", active: true')) {
        content = content.replace(
            '{ icon: Settings, label: "Settings", active: true',
            '{ icon: Star, label: "Verified Reviews", active: false, alert: 1, href: "/verified-reviews/admin" },\n    { icon: Settings, label: "Settings", active: true'
        );
    } else if(content.includes('label: "Settings", active: false, alert: 0')) {
        content = content.replace(
            '{ icon: Settings, label: "Settings", active: false, alert: 0',
            '{ icon: Star, label: "Verified Reviews", active: false, alert: 1, href: "/verified-reviews/admin" },\n    { icon: Settings, label: "Settings", active: false, alert: 0'
        );
    }
    // Mode 2: usermanagement
    else if(content.includes('label: "Settings", href: "/settings/admin", active: false')) {
        content = content.replace(
            '{ icon: Settings, label: "Settings", href: "/settings/admin", active: false',
            '{ icon: Star, label: "Verified Reviews", href: "/verified-reviews/admin", active: false, badge: 1 },\n    { icon: Settings, label: "Settings", href: "/settings/admin", active: false'
        );
    }
    // Mode 3: verification
    else if(content.includes('label: "Settings", active: false, badge: 0')) {
        content = content.replace(
            '{ icon: Settings, label: "Settings", active: false, badge: 0',
            '{ icon: Star, label: "Verified Reviews", active: false, badge: 1, href: "/verified-reviews/admin" },\n    { icon: Settings, label: "Settings", active: false, badge: 0'
        );
    }
  }
  
  fs.writeFileSync(f, content);
}
console.log("Admin Sidebars globally updated!");

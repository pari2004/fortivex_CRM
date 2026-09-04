const fs = require('fs');

const importStatement = "import CallAudioPlayer from '@/components/dashboard/CallAudioPlayer';\n";

function processFile(file) {
    let content = fs.readFileSync(file, 'utf8');

    if (!content.includes('CallAudioPlayer')) {
        content = content.replace("import { useCRM }", importStatement + "import { useCRM }");
    }

    const regex = /\{activity\.audioPlayer && \([\s\S]*?<Download size=\{18\} color="#64748b" cursor="pointer" \/>[\s\S]*?<\/div>[\s\n]*\)\}/g;
    
    content = content.replace(regex, "{activity.audioPlayer && <CallAudioPlayer duration={activity.duration} />}");

    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
}

processFile('src/components/dashboard/modals/LeadWorkspaceModal.tsx');
processFile('src/components/dashboard/modals/UserWorkspaceModal.tsx');

const fs = require('fs');
const file = 'src/contexts/CRMContext.tsx';
let content = fs.readFileSync(file, 'utf8');

// just add it below the first import
content = content.replace(
  "import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';",
  "import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';\nimport { useAuth } from '@/contexts/AuthContext';"
);

fs.writeFileSync(file, content);
console.log("Forced useAuth import");

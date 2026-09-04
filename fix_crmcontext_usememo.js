const fs = require('fs');
const file = 'src/contexts/CRMContext.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import React, { createContext, useContext, useState, useEffect } from 'react';",
  "import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';"
);

fs.writeFileSync(file, content);
console.log("Added useMemo to CRMContext imports");

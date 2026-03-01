const fs = require('fs');
const path = require('path');

const generateId = () => Math.random().toString(36).substring(2, 9);
const generateOid = () => [...Array(24)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

function createFlowchart(name, category, definition) {
  const nodes = [];
  const edges = [];
  let yOffset = 50;
  
  // Helper to parse structure
  const walk = (step, parentId, edgeLabel, xOffset = 300) => {
    const id = step.priority ? `outcome-${generateId()}` : `q-${generateId()}`;
    
    // Add Node
    nodes.push({
      id,
      position: { x: xOffset, y: yOffset },
      data: { 
        label: step.label, 
        priority: step.priority || undefined 
      },
      type: 'default'
    });
    
    // Add Edge
    if (parentId) {
      edges.push({
        id: `e-${parentId}-${id}`,
        source: parentId,
        target: id,
        label: edgeLabel || 'Next',
        animated: false
      });
    }

    const prevY = yOffset;
    
    if (step.yes) {
      yOffset += 150;
      walk(step.yes, id, 'Yes', xOffset - 150);
    }
    
    if (step.no) {
      // restore yOffset for siblings if needed, or just let it flow down
      if (!step.yes) yOffset += 150;
      walk(step.no, id, 'No', xOffset + 150);
    }
  };

  walk(definition, null, null);

  return {
    _id: generateOid(),
    name,
    category,
    isExpert: true,
    nodes,
    edges,
    createdAt: new Date().toISOString()
  };
}

const p1 = createFlowchart("Fever & Respiratory Assessment", "Fever", {
  label: "Does the patient have fever?",
  yes: {
    label: "Is temperature above 103°F?",
    yes: {
      label: "Is there difficulty breathing?",
      yes: { label: "Emergency respiratory distress. Escalate immediately.", priority: "RED" },
      no: { label: "High fever above 103°F. Escalate to doctor now.", priority: "RED" }
    },
    no: {
      label: "Has fever lasted more than 3 days?",
      yes: { label: "Persistent fever. Needs doctor evaluation.", priority: "YELLOW" },
      no: { label: "Moderate fever. Monitor every 2 hours.", priority: "YELLOW" }
    }
  },
  no: {
    label: "Is there cough or difficulty breathing?",
    yes: { label: "Respiratory symptoms without fever. Monitor.", priority: "YELLOW" },
    no: { label: "No fever or respiratory symptoms. Home care.", priority: "GREEN" }
  }
});

const p2 = createFlowchart("Chest Pain Assessment", "Cardiac", {
  label: "Is the chest pain severe (8-10 out of 10)?",
  yes: { label: "Severe chest pain. Call ambulance immediately.", priority: "RED" },
  no: {
    label: "Is pain radiating to arm or jaw?",
    yes: { label: "Possible cardiac event. Escalate now.", priority: "RED" },
    no: {
      label: "Is there shortness of breath?",
      yes: { label: "Chest pain with breathlessness. Immediate evaluation.", priority: "YELLOW" },
      no: {
        label: "Has pain lasted more than 20 minutes?",
        yes: { label: "Prolonged chest pain. Needs evaluation.", priority: "YELLOW" },
        no: { label: "Mild chest pain. Monitor and evaluate.", priority: "YELLOW" }
      }
    }
  }
});

const p3 = createFlowchart("Pediatric Fever Protocol", "Pediatric", {
  label: "Is the child under 3 months old?",
  yes: { label: "Any fever in infant under 3 months is emergency.", priority: "RED" },
  no: {
    label: "Is temperature above 104°F?",
    yes: { label: "Dangerously high fever. Escalate immediately.", priority: "RED" },
    no: {
      label: "Is child lethargic or not responding normally?",
      yes: { label: "Altered consciousness in child. Emergency.", priority: "RED" },
      no: {
        label: "Has fever lasted more than 2 days?",
        yes: { label: "Persistent pediatric fever. Doctor evaluation needed.", priority: "YELLOW" },
        no: { label: "Moderate pediatric fever. Monitor every hour.", priority: "YELLOW" }
      }
    }
  }
});

const p4 = createFlowchart("Wound & Bleeding Assessment", "Emergency", {
  label: "Is there severe uncontrolled bleeding?",
  yes: { label: "Severe bleeding. Apply pressure. Emergency immediately.", priority: "RED" },
  no: {
    label: "Is the wound deeper than 1cm or gaping open?",
    yes: { label: "Deep wound. Needs stitching. Send to doctor.", priority: "YELLOW" },
    no: {
      label: "Are there signs of infection (redness, pus, swelling)?",
      yes: { label: "Wound infection signs. Needs medical treatment.", priority: "YELLOW" },
      no: { label: "Minor wound. Clean and bandage. Home care.", priority: "GREEN" }
    }
  }
});

const p5 = createFlowchart("Unconscious Patient Protocol", "Emergency", {
  label: "Is the patient completely unconscious?",
  yes: { label: "Unconscious patient. Emergency. Call ambulance now.", priority: "RED" },
  no: {
    label: "Is the patient confused or disoriented?",
    yes: {
      label: "Has patient had a seizure?",
      yes: { label: "Post-seizure state. Emergency escalation.", priority: "RED" },
      no: { label: "Altered mental status. Escalate immediately.", priority: "RED" }
    },
    no: {
      label: "Is patient complaining of severe headache?",
      yes: { label: "Severe headache with mild confusion. Evaluate.", priority: "YELLOW" },
      no: { label: "Patient alert and oriented. Monitor.", priority: "GREEN" }
    }
  }
});

const result = [p1, p2, p3, p4, p5];

const dir = path.join(__dirname, 'client/src/data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const dest = path.join(dir, 'expertFlowcharts.json');
fs.writeFileSync(dest, JSON.stringify(result, null, 2));
console.log('Saved to', dest);

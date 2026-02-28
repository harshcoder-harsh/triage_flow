const Flowchart = require('../models/Flowchart');

const seedExpertFlowcharts = async () => {
  try {
    const expertCount = await Flowchart.countDocuments({ isExpert: true });
    if (expertCount === 0) {
      console.log('Seeding expert flowcharts...');
      
      const expert1 = {
        name: "Fever & Respiratory Assessment",
        category: "Fever",
        isExpert: true,
        nodes: [
          { id: '1', position: {x: 300, y: 50}, data: { label: "Does the patient have fever?"}, type: 'default',
            style: { background: '#fff', border: '2px solid #1e293b', borderRadius: '12px', padding: '16px', width: 180, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } },
          { id: '2', position: {x: 100, y: 200}, data: { label: "Is temperature above 103°F?"}, type: 'default',
            style: { background: '#fff', border: '2px solid #1e293b', borderRadius: '12px', padding: '16px', width: 180, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } },
          { id: '3', position: {x: -100, y: 350}, data: { label: "Is there difficulty breathing?"}, type: 'default',
            style: { background: '#fff', border: '2px solid #1e293b', borderRadius: '12px', padding: '16px', width: 180, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } },
          { id: 'A', position: {x: -200, y: 500}, data: { label: "🔴 Emergency respiratory distress. Escalate immediately.", priority: "RED", riskScore: 10}, type: 'default',
            style: { background: '#FEF2F2', border: '3px solid #EF4444', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} },
          { id: 'B', position: {x: 0, y: 500}, data: { label: "🔴 High fever above 103°F. Escalate to doctor.", priority: "RED", riskScore: 8}, type: 'default',
            style: { background: '#FEF2F2', border: '3px solid #EF4444', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} },
          { id: 'C', position: {x: 300, y: 350}, data: { label: "🟡 Moderate fever. Monitor every 2 hours.", priority: "YELLOW", riskScore: 5}, type: 'default',
            style: { background: '#FFFBEB', border: '3px solid #F59E0B', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} },
          { id: '4', position: {x: 500, y: 200}, data: { label: "Is there cough or difficulty breathing?"}, type: 'default',
            style: { background: '#fff', border: '2px solid #1e293b', borderRadius: '12px', padding: '16px', width: 180, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } },
          { id: 'D', position: {x: 500, y: 350}, data: { label: "🟡 Respiratory symptoms without fever. Monitor.", priority: "YELLOW", riskScore: 4}, type: 'default',
            style: { background: '#FFFBEB', border: '3px solid #F59E0B', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} },
          { id: 'E', position: {x: 700, y: 350}, data: { label: "🟢 No fever or respiratory symptoms. Home care advised.", priority: "GREEN", riskScore: 1}, type: 'default',
            style: { background: '#F0FDF4', border: '3px solid #10B981', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} }
        ],
        edges: [
          {id: 'e1-2', source: '1', target: '2', label: 'Yes', animated: false, style:{strokeWidth: 2}},
          {id: 'e2-3', source: '2', target: '3', label: 'Yes', animated: false, style:{strokeWidth: 2}},
          {id: 'e3-A', source: '3', target: 'A', label: 'Yes', animated: false, style:{strokeWidth: 2}},
          {id: 'e3-B', source: '3', target: 'B', label: 'No', animated: false, style:{strokeWidth: 2}},
          {id: 'e2-C', source: '2', target: 'C', label: 'No', animated: false, style:{strokeWidth: 2}},
          {id: 'e1-4', source: '1', target: '4', label: 'No', animated: false, style:{strokeWidth: 2}},
          {id: 'e4-D', source: '4', target: 'D', label: 'Yes', animated: false, style:{strokeWidth: 2}},
          {id: 'e4-E', source: '4', target: 'E', label: 'No', animated: false, style:{strokeWidth: 2}}
        ]
      };

      const expert2 = {
        name: "Chest Pain Assessment",
        category: "Cardiac",
        isExpert: true,
        nodes: [
          { id: '1', position: {x: 300, y: 50}, data: { label: "Is chest pain severe (8-10 out of 10)?"}, type: 'default', style: { background: '#fff', border: '2px solid #1e293b', borderRadius: '12px', padding: '16px', width: 180 } },
          { id: 'A', position: {x: 100, y: 200}, data: { label: "🔴 Severe chest pain. Call ambulance immediately.", priority: "RED", riskScore: 10}, type: 'default', style: { background: '#FEF2F2', border: '3px solid #EF4444', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} },
          { id: '2', position: {x: 500, y: 200}, data: { label: "Is pain radiating to arm or jaw?"}, type: 'default', style: { background: '#fff', border: '2px solid #1e293b', borderRadius: '12px', padding: '16px', width: 180 } },
          { id: 'B', position: {x: 300, y: 350}, data: { label: "🔴 Possible cardiac event. Escalate now.", priority: "RED", riskScore: 9}, type: 'default', style: { background: '#FEF2F2', border: '3px solid #EF4444', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} },
          { id: '3', position: {x: 700, y: 350}, data: { label: "Is there shortness of breath?"}, type: 'default', style: { background: '#fff', border: '2px solid #1e293b', borderRadius: '12px', padding: '16px', width: 180 } },
          { id: 'C', position: {x: 500, y: 500}, data: { label: "🟡 Chest pain with breathlessness. Immediate evaluation needed.", priority: "YELLOW", riskScore: 6}, type: 'default', style: { background: '#FFFBEB', border: '3px solid #F59E0B', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} },
          { id: 'D', position: {x: 900, y: 500}, data: { label: "🟡 Mild chest pain. Evaluate within 1 hour.", priority: "YELLOW", riskScore: 4}, type: 'default', style: { background: '#FFFBEB', border: '3px solid #F59E0B', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} }
        ],
        edges: [
          {id: 'e1-A', source: '1', target: 'A', label: 'Yes', animated: false, style:{strokeWidth: 2}},
          {id: 'e1-2', source: '1', target: '2', label: 'No', animated: false, style:{strokeWidth: 2}},
          {id: 'e2-B', source: '2', target: 'B', label: 'Yes', animated: false, style:{strokeWidth: 2}},
          {id: 'e2-3', source: '2', target: '3', label: 'No', animated: false, style:{strokeWidth: 2}},
          {id: 'e3-C', source: '3', target: 'C', label: 'Yes', animated: false, style:{strokeWidth: 2}},
          {id: 'e3-D', source: '3', target: 'D', label: 'No', animated: false, style:{strokeWidth: 2}}
        ]
      };

      const expert3 = {
        name: "Pediatric Fever Protocol",
        category: "Pediatric",
        isExpert: true,
        nodes: [
          { id: '1', position: {x: 300, y: 50}, data: { label: "Is the child under 3 months old?"}, type: 'default', style: { background: '#fff', border: '2px solid #1e293b', borderRadius: '12px', padding: '16px', width: 180 } },
          { id: 'A', position: {x: 100, y: 200}, data: { label: "🔴 Any fever in infant under 3 months is emergency.", priority: "RED", riskScore: 10}, type: 'default', style: { background: '#FEF2F2', border: '3px solid #EF4444', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} },
          { id: '2', position: {x: 500, y: 200}, data: { label: "Is temperature above 104°F?"}, type: 'default', style: { background: '#fff', border: '2px solid #1e293b', borderRadius: '12px', padding: '16px', width: 180 } },
          { id: 'B', position: {x: 300, y: 350}, data: { label: "🔴 Dangerously high fever. Escalate immediately.", priority: "RED", riskScore: 9}, type: 'default', style: { background: '#FEF2F2', border: '3px solid #EF4444', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} },
          { id: '3', position: {x: 700, y: 350}, data: { label: "Is child lethargic or not responding?"}, type: 'default', style: { background: '#fff', border: '2px solid #1e293b', borderRadius: '12px', padding: '16px', width: 180 } },
          { id: 'C', position: {x: 500, y: 500}, data: { label: "🔴 Altered consciousness. Emergency escalation required.", priority: "RED", riskScore: 9}, type: 'default', style: { background: '#FEF2F2', border: '3px solid #EF4444', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} },
          { id: 'D', position: {x: 900, y: 500}, data: { label: "🟡 Moderate pediatric fever. Monitor every hour.", priority: "YELLOW", riskScore: 4}, type: 'default', style: { background: '#FFFBEB', border: '3px solid #F59E0B', borderRadius: '12px', padding: '16px', width: 180, fontWeight: 'bold'} }
        ],
        edges: [
          {id: 'e1-A', source: '1', target: 'A', label: 'Yes', animated: false, style:{strokeWidth: 2}},
          {id: 'e1-2', source: '1', target: '2', label: 'No', animated: false, style:{strokeWidth: 2}},
          {id: 'e2-B', source: '2', target: 'B', label: 'Yes', animated: false, style:{strokeWidth: 2}},
          {id: 'e2-3', source: '2', target: '3', label: 'No', animated: false, style:{strokeWidth: 2}},
          {id: 'e3-C', source: '3', target: 'C', label: 'Yes', animated: false, style:{strokeWidth: 2}},
          {id: 'e3-D', source: '3', target: 'D', label: 'No', animated: false, style:{strokeWidth: 2}}
        ]
      };

      await Flowchart.insertMany([expert1, expert2, expert3]);
      console.log('Expert flowcharts seeded.');
    }
  } catch(err) {
    console.error('Failed to seed expert flowcharts:', err);
  }
};

module.exports = { seedExpertFlowcharts };

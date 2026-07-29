import { docData } from '../data/documents';
import ActionMessage from './ActionMessage';

export default function DocumentsView({
  activeDocType,
  checkedDocs,
  onSelectType,
  onToggleDoc,
}) {
  const types = Object.keys(docData || {});
  const safeType = types.includes(activeDocType) ? activeDocType : types[0] || null;
  const items = safeType && Array.isArray(docData[safeType]) ? docData[safeType] : [];
  const checks = checkedDocs && typeof checkedDocs === 'object' ? checkedDocs : {};

  const checkedCount = items.reduce(
    (count, _, i) => count + (checks[`${safeType}::${i}`] ? 1 : 0),
    0,
  );
  const complete = checkedCount === items.length && items.length > 0;

  if (!safeType || types.length === 0) {
    return (
      <section className="view active" id="view-docs">
        <div className="view-header">
          <div>
            <h2>Required Documents</h2>
            <p>Select your claim type to see what to gather.</p>
          </div>
        </div>
        <div className="doc-body">
          <ActionMessage>
            Document checklists aren&apos;t available right now. Please escalate to an agent for
            the paperwork list for your claim type.
          </ActionMessage>
        </div>
      </section>
    );
  }

  function handleToggle(key, checked) {
    try {
      onToggleDoc(key, checked);
    } catch (err) {
      console.error('DocumentsView toggle failed:', err);
    }
  }

  function handleSelect(type) {
    try {
      onSelectType(type);
    } catch (err) {
      console.error('DocumentsView select failed:', err);
    }
  }

  return (
    <section className="view active" id="view-docs">
      <div className="view-header">
        <div>
          <h2>Required Documents</h2>
          <p>Select your claim type to see what to gather.</p>
        </div>
      </div>
      <div className="doc-body">
        {!types.includes(activeDocType) ? (
          <ActionMessage tone="info">
            That claim type wasn&apos;t found, so we&apos;re showing {safeType}. Pick another type
            below if needed.
          </ActionMessage>
        ) : null}

        <div className="type-pills" id="typePills">
          {types.map((type) => (
            <button
              key={type}
              type="button"
              className={`type-pill${type === safeType ? ' active' : ''}`}
              onClick={() => handleSelect(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <ActionMessage>
            No documents are listed for {safeType}. Escalate to an agent for a custom checklist.
          </ActionMessage>
        ) : (
          <>
            <div className={`checklist-complete${complete ? ' show' : ''}`} id="checklistComplete">
              <span>✓</span> Checklist complete — you&apos;re ready to submit this claim type.
            </div>

            <div className="checklist-progress" id="checklistProgress">
              {checkedCount} of {items.length} items checked
            </div>

            <ul className="checklist" id="docList">
              {items.map((item, i) => {
                const key = `${safeType}::${i}`;
                const checkboxId = `doc-${safeType.replace(/\s+/g, '-').toLowerCase()}-${i}`;
                const isChecked = !!checks[key];
                const docName = item?.[0] || `Document ${i + 1}`;
                const docWhy = item?.[1] || 'Helpful for reviewing this claim type.';
                return (
                  <li key={key} className={isChecked ? 'checked' : ''}>
                    <label className="doc-row" htmlFor={checkboxId}>
                      <input
                        type="checkbox"
                        id={checkboxId}
                        checked={isChecked}
                        onChange={(e) => handleToggle(key, e.target.checked)}
                      />
                      <span className="doc-copy">
                        <span className="doc-name">{docName}</span>
                        <span className="doc-why">{docWhy}</span>
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

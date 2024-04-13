export default function SelectMenu(options, id, onChange) {
  const optionElements = options.options.map(option => (
    <option key={option} value={option}>{option}</option>
  ));

  return (
    <select className="m-1" id={options.id} onChange={options.onChange}>
      {optionElements}
    </select>
  );
}

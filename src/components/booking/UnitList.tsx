import UnitCard from "./UnitCard";


interface UnitListProps {
  propertySlug:string;
  units:any[];
}


export default function UnitList({
  propertySlug,
  units,
}:UnitListProps){

  if(units.length === 0){

    return (
      <p
        style={{
          color:"#6B5D4F",
        }}
      >
        Belum ada kamar tersedia.
      </p>
    );

  }


  return (

    <div className="space-y-5">

      {units.map((unit)=>(
        <UnitCard
          key={unit.id}
          propertySlug={propertySlug}
          unit={unit}
        />
      ))}

    </div>

  );

}
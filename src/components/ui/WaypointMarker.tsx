import React from 'react';
import * as THREE from 'three';

const WaypointMarker = React.memo(
  ({ position, isCurrent, threshold = 5 }: { position: THREE.Vector3; isCurrent: boolean; threshold?: number }) => (
    <mesh position={position}>
      <sphereGeometry args={[threshold / 2, 16, 16]} />
      <meshBasicMaterial color={isCurrent ? 'red' : 'blue'} transparent opacity={0} />
    </mesh>
  )
);

export default WaypointMarker;
// import { Injectable } from "@angular/core";
// import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
// import { map } from "rxjs";

// @Injectable({
//     providedIn: 'root'
//   })
//   export class BlockResolver implements Resolve<any> {
//     constructor(private yourService: YourService) {}
  
//     resolve(route: ActivatedRouteSnapshot): Observable<any> {
//       const blockId = route.paramMap.get('blockId');
//       return this.yourService.getBlockById(blockId).pipe(
//         map(block => {
//           // Cập nhật breadcrumb data với tên thực của khối
//           route.data = {
//             ...route.data,
//             breadcrumb: `Khối ${block.name}`
//           };
//           return block;
//         })
//       );
//     }
//   }